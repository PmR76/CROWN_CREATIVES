// corelab-tree.js
// Simple File Tree Scanner for Core Lab (Layer 3 Verification)

const fs = require("fs");
const path = require("path");

const ROOT = path.join("C:", "DEV", "CROWN_CREATIVES", "corelab");

function scan(dir, indent = "") {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    // Skip node_modules or hidden system folders
    if (item.name === "node_modules" || item.name.startsWith(".")) continue;

    if (item.isDirectory()) {
      console.log(`${indent}📁 ${item.name}`);
      scan(fullPath, indent + "   ");
    } else {
      console.log(`${indent}📄 ${item.name}`);
    }
  }
}

console.log("=== CORE LAB FILE TREE (Layer 3) ===");
console.log(`Root: ${ROOT}\n`);
scan(ROOT);
