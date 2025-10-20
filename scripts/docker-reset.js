import { execSync } from "child_process";

try {
  console.log("🧹 Cleaning up unused dangling Docker images...");
  execSync("docker image prune -f", { stdio: "inherit" });

  console.log("🛑 Stopping and removing Docker containers...");
  execSync("npm run docker:down", { stdio: "inherit" });

  console.log("🚀 Rebuilding and starting Docker containers...");
  execSync("npm run docker:up", { stdio: "inherit" });

  console.log("✅ Docker environment reset and cleaned successfully!");
} catch (err) {
  console.error("❌ Failed to reset Docker environment:", err.message);
  process.exit(1);
}
