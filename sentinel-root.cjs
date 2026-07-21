// sentinel-root.cjs — CommonJS wrapper

const fs = require("fs");
const path = require("path");

function getRoot() {
  const configPath = path.join(process.cwd(), "sentinel-root.json");

  if (!fs.existsSync(configPath)) {
    return process.cwd();
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const rootFolder = config.root || ".";

  return path.join(process.cwd(), rootFolder);
}

module.exports = { getRoot };
