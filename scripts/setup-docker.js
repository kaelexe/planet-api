import fs from "fs";
import { execSync } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const { NODE_ENV, PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_DIALECT } =
  process.env;

// --- File paths ---
const files = {
  dockerfile: "./Dockerfile",
  compose: "./docker-compose.yml",
  entrypoint: "./docker-entrypoint.sh",
};

// --- docker-entrypoint.sh ---
const entrypoint = `#!/bin/sh
set -e

echo "🔧 Starting Planet API setup..."

# Load environment variables
if [ -f .env ]; then
  echo "✅ Loading environment variables from .env"
  export $(grep -v '^#' .env | xargs)
fi

# Wait for MySQL to be ready
echo "⏳ Waiting for ${DB_HOST} to be ready..."
until nc -z ${DB_HOST} 3306; do
  echo "⏳ Waiting for MySQL..."
  sleep 2
done

echo "✅ Database is ready. Running migrations..."
# Retry migrations until successful
until npx sequelize-cli db:migrate --config config/config.cjs; do
  echo "⏳ Migrations failed, retrying..."
  sleep 2
done

# Build TS project if dist does not exist
if [ ! -d "dist" ]; then
  echo "🛠 Building TypeScript project..."
  npm run build
else
  echo "✅ Build directory exists — skipping build."
fi

echo "🚀 Starting Planet API..."
exec node dist/src/server.js
`;

// --- Dockerfile ---
const dockerfile = `# ----------------------------
# 🏗️ Build Stage
# ----------------------------
FROM node:18-alpine AS build

WORKDIR /app

# Copy dependency files first
COPY package*.json tsconfig.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build TypeScript
RUN npm run build

# ----------------------------
# 🚀 Runtime Stage
# ----------------------------
FROM node:18-alpine

WORKDIR /app

# Copy necessary files from build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/config ./config
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/docker-entrypoint.sh ./docker-entrypoint.sh

# Make entrypoint executable
RUN chmod +x ./docker-entrypoint.sh

EXPOSE ${PORT}

ENTRYPOINT ["./docker-entrypoint.sh"]
`;

// --- docker-compose.yml ---
const compose = `version: "3.8"

services:
  api:
    build: .
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
    networks:
      - planet-net

  db:
    image: mysql:8
    container_name: ${DB_HOST}
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
    volumes:
      - planet-mysql-data:/var/lib/mysql
    ports:
      - "3306:3306"
    networks:
      - planet-net
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  planet-mysql-data:

networks:
  planet-net:
`;

// --- Safeguard system ---
function fileExists(path) {
  return fs.existsSync(path);
}

function createFile(path, content) {
  fs.writeFileSync(path, content.trim() + "\n");
  console.log(`📝 Created ${path}`);
}

console.log("🔍 Checking Docker setup files...");

const existingFiles = Object.entries(files)
  .filter(([_, path]) => fileExists(path))
  .map(([name]) => name);

if (existingFiles.length === Object.keys(files).length) {
  console.log("✅ All Docker setup files already exist. Skipping creation...");
} else {
  console.log("⚙️ Generating missing Docker setup files...");
  if (!fileExists(files.dockerfile)) createFile(files.dockerfile, dockerfile);
  if (!fileExists(files.compose)) createFile(files.compose, compose);
  if (!fileExists(files.entrypoint)) createFile(files.entrypoint, entrypoint);
  console.log("✅ Docker setup files created successfully.");
}

// --- Build & Run containers ---
try {
  console.log("🚀 Building and starting Docker containers...");
  execSync("docker compose up --build -d", { stdio: "inherit" });
  console.log("✅ Docker environment is up and running.");
} catch (err) {
  console.error("❌ Failed to start Docker containers:", err.message);
}
