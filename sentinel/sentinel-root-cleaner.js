// ============================================================
// Sentinel Root Cleaner — safely declutters the entire project
// ============================================================

const fs = require("fs");
const path = require("path");

const ROOT = "C:/DEV/CROWN_CREATIVES";
const ARCHIVE_DIR = path.join(ROOT, "archive.disabled/root-clean");

if (!fs.existsSync(ARCHIVE_DIR)) {
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
}

// ------------------------------------------------------------
// 1. Define KEEP / OPTIONAL / ARCHIVE lists
// ------------------------------------------------------------

const KEEP = [
  ".cloudflare",
  ".github",
  ".vscode",
  "corelab",
  "node_modules",
  "scripts",
  "sentinel",
  "src",
  "tools",
  ".env",
  ".gitignore",
  ".gitattributes",
  "_headers",
  "CNAME",
  "deploy.cmd",
  "deploy.js",
  "favicon.ico",
  "package.json",
  "package-lock.json",
  "sentinel-root.js",
  "sentinel-root.json",
  "sentinel-bootstrap.ps1",
  "check-imports.ps1",
  "check-unused-images.js",
  "conflict-scan.js",
  "corelab-tree.js"
];

const OPTIONAL = [
  "run-menu.cmd",
  "replace.txt",
  "sentinel-root.ot.js",
  "archive.disabled"
];

const ARCHIVE = []; // auto-filled by scanning

// ------------------------------------------------------------
// 2. Scan root and detect archive candidates
// ------------------------------------------------------------

const rootItems = fs.readdirSync(ROOT);

rootItems.forEach(item => {
  if (!KEEP.includes(item) && !OPTIONAL.includes(item)) {
    ARCHIVE.push(item);
  }
});

// ------------------------------------------------------------
// 3. Archive items
// ------------------------------------------------------------

function archiveItem(item) {
  const fullPath = path.join(ROOT, item);
  const dest = path.join(ARCHIVE_DIR, item);

  fs.renameSync(fullPath, dest);
  console.log(`Archived: ${item}`);
}

console.log("=== Sentinel Root Cleaner ===");

ARCHIVE.forEach(item => archiveItem(item));

console.log("\n=== Summary ===");
console.log("Kept:", KEEP.length, "items");
console.log("Optional:", OPTIONAL.length, "items");
console.log("Archived:", ARCHIVE.length, "items");

console.log("\nRoot is now clean and stable.");
