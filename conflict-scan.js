import fs from "fs";
import path from "path";

const ROOT = "C:/DEV/CROWN_CREATIVES";

const TARGETS = [
  "index.html",
  "vite.config.js",
  "vite.config.mjs",
  "package.json",
  "node_modules",
  "src",
  "public",
  "dist"
];

const IGNORE = [
  "corelab/node_modules",
  "corelab/dist",
  "corelab/public",
  "corelab/src"
];

function walk(dir, results = []) {
  const list = fs.readdirSync(dir);

  for (const file of list) {
    const full = path.join(dir, file);
    const rel = full.replace(ROOT, "").replace(/\\/g, "/");

    // Skip ignored paths
    if (IGNORE.some(i => rel.startsWith(i))) continue;

    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full, results);
    } else {
      results.push(rel);
    }
  }

  return results;
}

function scanConflicts() {
  const files = walk(ROOT);
  const conflicts = {};

  for (const target of TARGETS) {
    conflicts[target] = files.filter(f => f.endsWith("/" + target));
  }

  return conflicts;
}

function report(conflicts) {
  console.log("=== CORELAB CONFLICT SCAN REPORT ===\n");

  for (const key of Object.keys(conflicts)) {
    const list = conflicts[key];

    if (list.length <= 1) continue;

    console.log(`⚠️  Multiple '${key}' detected:`);
    list.forEach(f => console.log("   → " + f));
    console.log("");
  }

  console.log("\n=== RECOMMENDED ACTIONS ===");

  console.log(`
• Delete ANY index.html outside /corelab/public
• Delete ANY vite.config.* outside /corelab
• Delete ANY src/ or public/ folders outside /corelab
• Delete ANY dist/ folders outside /corelab
• Delete ANY node_modules outside /corelab
• Delete ANY leftover test/core-lab-react folders
• Delete ANY leftover core-lab-react folders
• Delete ANY old React/Vite project roots
`);
}

const conflicts = scanConflicts();
report(conflicts);
