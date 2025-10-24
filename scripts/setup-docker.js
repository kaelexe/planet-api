import fs from "fs";
import { execSync, spawn } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const { NODE_ENV, PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const isDev = NODE_ENV === "development";

// --- File paths ---
const files = {
  dockerfile: isDev ? "./Dockerfile.dev" : "./Dockerfile",
  compose: "./docker-compose.yml",
  entrypoint: "./docker-entrypoint.sh",
  cacheFile: "./.docker-env-cache",
};

// --- docker-entrypoint.sh ---
const entrypoint = `#!/bin/sh
set -e

echo "[$(date)] 🔧 Starting Planet API setup..."

# Load environment variables
if [ -f .env ]; then
  echo "[$(date)] ✅ Loading environment variables from .env"
  export $(grep -v '^#' .env | xargs)
fi

# ✅ Safe cleanup for dangling images
echo "[$(date)] 🧹 Cleaning up dangling images for 'planet-api'..."
docker image prune -f --filter label=com.docker.compose.project=planet-api || true

# Wait for MySQL to be ready
echo "[$(date)] ⏳ Waiting for ${DB_HOST} to be ready..."
until nc -z ${DB_HOST} 3306; do
  echo "[$(date)] ⏳ Waiting for MySQL..."
  sleep 2
done

echo "[$(date)] ✅ Database is ready. Running migrations..."
until npx sequelize-cli db:migrate --config config/config.cjs; do
  echo "[$(date)] ⏳ Migrations failed, retrying..."
  sleep 2
done

# --- Mode Switch ---
if [ "$NODE_ENV" = "development" ]; then
  echo "[$(date)] 👀 Development mode detected..."
  echo "[$(date)] 🚀 Starting Planet API ${NODE_ENV}..."
  exec npm run dev
else
  echo "[$(date)] 🏗️ Production mode detected..."
  if [ ! -d "dist" ]; then
    echo "[$(date)] 🛠 Building TypeScript project..."
    npm run build
  fi
  exec node dist/src/server.js
fi
`;

// --- Dockerfile.dev ---
const dockerfileDev = `# ----------------------------
# 🧩 Development Dockerfile
# ----------------------------
FROM node:18-alpine

WORKDIR /app
    
COPY package*.json tsconfig.json ./
RUN npm install
    
# Copy only the entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh
    
ENV NODE_ENV=development
    
EXPOSE ${PORT}
ENTRYPOINT ["./docker-entrypoint.sh"]
`;

// --- Dockerfile (production) ---
const dockerfileProd = `# ----------------------------
# 🏗️ Build Stage
# ----------------------------
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build

# ----------------------------
# 🚀 Runtime Stage
# ----------------------------
FROM node:18-alpine
WORKDIR /app

COPY --from=build /app/package*.json ./ 
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/config ./config
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh

EXPOSE ${PORT}
ENTRYPOINT ["./docker-entrypoint.sh"]
`;

// --- docker-compose.yml ---
const compose = `version: "3.8"
name: planet-api

services:
  api:
    build:
      context: .
      dockerfile: ${isDev ? "Dockerfile.dev" : "Dockerfile"}
    container_name: planet-api
    restart: always
    ports:
      - "${PORT}:${PORT}"
    env_file:
      - .env
    depends_on:
      - db
    volumes:
      - .:/app
      - /app/node_modules
    networks:
      - planet_network

  db:
    image: mysql:8
    container_name: planet-${DB_HOST}
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
    volumes:
      - planet-mysql-data:/var/lib/mysql
    ports:
      - "3306:3306"
    networks:
      - planet_network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  planet-mysql-data:

networks:
  planet_network:
    external: true
`;

// --- Helpers ---
const fileExists = (path) => fs.existsSync(path);
const createFile = (path, content) => {
  fs.writeFileSync(path, content.trim() + "\n");
  console.log(`📝 Created ${path}`);
};

// --- Detect environment change ---
let cachedEnv = "";
if (fileExists(files.cacheFile))
  cachedEnv = fs.readFileSync(files.cacheFile, "utf-8").trim();

if (cachedEnv !== NODE_ENV) {
  console.log(
    `⚙️ Environment changed (${
      cachedEnv || "none"
    } → ${NODE_ENV}). Regenerating files...`
  );
  Object.values(files).forEach((path) => {
    if (path !== files.cacheFile && fileExists(path)) fs.unlinkSync(path);
  });
} else {
  console.log(`🔍 Using existing files for environment: ${NODE_ENV}`);
}

// --- Write environment cache ---
fs.writeFileSync(files.cacheFile, NODE_ENV);

// --- Generate files if missing ---
if (!fileExists(files.entrypoint)) createFile(files.entrypoint, entrypoint);
if (!fileExists(files.compose)) createFile(files.compose, compose);
if (!fileExists(files.dockerfile))
  createFile(files.dockerfile, isDev ? dockerfileDev : dockerfileProd);

// --- Safe cleanup & Docker startup ---
try {
  console.log("🧹 Performing safe cleanup for dangling images...");
  execSync(
    "docker image prune -f --filter label=com.docker.compose.project=planet-api || true",
    {
      stdio: "inherit",
    }
  );

  console.log("🚀 Building and starting Docker containers...");
  execSync("docker compose up --build -d", { stdio: "inherit" });

  console.log("✅ Docker environment is up and running.");
} catch (err) {
  console.error("❌ Failed to start Docker containers:", err.message);
  process.exit(1);
}
