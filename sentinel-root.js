// sentinel-root.js — shared root resolver

import fs from "fs";
import path from "path";

export function getRoot() {
  const configPath = path.join(process.cwd(), "sentinel-root.json");

  if (!fs.existsSync(configPath)) {
    // Fallback: assume current working directory is the root
    return process.cwd();
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const rootFolder = config.root || ".";

  return path.join(process.cwd(), rootFolder);
}
