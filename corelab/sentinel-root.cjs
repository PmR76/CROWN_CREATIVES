// sentinel-root.cjs — resolves the root folder for corelab

const path = require("path");

function getRoot() {
  // Cloudflare builds inside /opt/buildhome/repo/corelab
  // Locally, process.cwd() will also be corelab
  return process.cwd();
}

module.exports = { getRoot };
