import { execSync } from "child_process";

console.log("[v0] Installing dependencies...");
execSync("npm install", {
  cwd: "/vercel/share/v0-project",
  stdio: "inherit",
});
console.log("[v0] Done.");
