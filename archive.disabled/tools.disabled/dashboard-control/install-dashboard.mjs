import fs from "fs";
import path from "path";

// ROOTS
const ROOT = "C:/DEV/CROWN_CREATIVES/tools";
const DASHBOARD = path.join(ROOT, "dashboard-control");
const SCANNER_DASHBOARD = path.join(ROOT, "scanner-dashboard");

// TARGET STRUCTURE
const PUBLIC = path.join(DASHBOARD, "public");
const CSS = path.join(PUBLIC, "css");
const JS = path.join(PUBLIC, "js");
const MODULES = path.join(PUBLIC, "modules");
const ASSETS = path.join(PUBLIC, "assets");

// Ensure folder exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log("📁 Created:", dir);
  }
}

// Copy file safely
function safeCopy(src, dest) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log("📄 Copied:", src, "→", dest);
  } else {
    console.log("⚠️ Missing file:", src);
  }
}

// 1. Create folder structure
ensureDir(PUBLIC);
ensureDir(CSS);
ensureDir(JS);
ensureDir(MODULES);
ensureDir(ASSETS);

// 2. Move dashboard.html + index.html into /public
safeCopy(
  path.join(SCANNER_DASHBOARD, "dashboard.html"),
  path.join(PUBLIC, "dashboard.html")
);

safeCopy(
  path.join(SCANNER_DASHBOARD, "index.html"),
  path.join(PUBLIC, "index.html")
);

// 3. Create placeholder folders for missing UI files
fs.writeFileSync(path.join(CSS, "placeholder.css"), "/* dashboard css */");
fs.writeFileSync(path.join(JS, "placeholder.js"), "// dashboard js");
fs.writeFileSync(path.join(MODULES, "placeholder.txt"), "modules go here");
fs.writeFileSync(path.join(ASSETS, "placeholder.txt"), "assets go here");

console.log("\n🎉 Dashboard structure installed successfully!");
console.log("➡️  Now run:  node server.mjs");
