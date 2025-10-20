import { execSync } from "child_process";

try {
  console.log("🛑 Stopping and removing Docker containers...");
  execSync("npm run docker:down", { stdio: "inherit" });

  console.log("🚀 Rebuilding and starting Docker containers...");
  execSync("npm run docker:up", { stdio: "inherit" });

  console.log("✅ Docker environment reset successfully!");
} catch (err) {
  console.error("❌ Failed to reset Docker environment:", err.message);
  process.exit(1);
}
