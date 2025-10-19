import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const MIGRATIONS_DIR = path.resolve("migrations");

// Ensure folder exists
if (!fs.existsSync(MIGRATIONS_DIR)) {
  fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
}

// --- Step 1: Get migration name from CLI ---
const migrationName = process.argv[2];
if (!migrationName) {
  console.error("❌ Please provide a migration name, e.g.:");
  console.error("   npm run make:migration create-tasks-table");
  process.exit(1);
}

// --- Step 2: Determine next index ---
const files = fs
  .readdirSync(MIGRATIONS_DIR)
  .filter((f) => f.endsWith(".cjs") || f.endsWith(".js"))
  .sort();

let nextIndex = 0;
if (files.length > 0) {
  const last = files[files.length - 1];
  const match = last.match(/^(\d{3})-/);
  if (match) nextIndex = parseInt(match[1]) + 1;
}

const indexStr = String(nextIndex).padStart(3, "0");
const newFileName = `${indexStr}-${migrationName}.cjs`;
const newFilePath = path.join(MIGRATIONS_DIR, newFileName);

// --- Step 3: Generate the migration via Sequelize CLI ---
console.log(`⚙️ Generating Sequelize migration: ${migrationName}`);
execSync(`npx sequelize-cli migration:generate --name ${migrationName}`, {
  stdio: "inherit",
});

// --- Step 4: Find the generated .js file ---
const generatedFile = fs
  .readdirSync(MIGRATIONS_DIR)
  .filter((f) => f.endsWith(".js"))
  .map((f) => path.join(MIGRATIONS_DIR, f))
  .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];

if (!generatedFile) {
  console.error("❌ Could not find newly generated migration file.");
  process.exit(1);
}

// --- Step 5: Rename and convert to .cjs ---
fs.renameSync(generatedFile, newFilePath);
console.log(`✅ Migration created: ${newFilePath}`);
