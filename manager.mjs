#!/usr/bin/env node
import fs from "fs";
import path from "path";

// Root of your creative website
const ROOT = path.resolve(".");
const BACKUPS_DIR = path.join(ROOT, "backups");
const LOGS_DIR = path.join(ROOT, "logs");

// Ensure required folders exist
function ensureDirs() {
  for (const dir of [BACKUPS_DIR, LOGS_DIR]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

// Copy directory recursively
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

// Create a full backup snapshot
export function createBackup(label = "manual") {
  ensureDirs();
  const stamp = timestamp();
  const backupRoot = path.join(BACKUPS_DIR, `${stamp}-${label}`);
  fs.mkdirSync(backupRoot);

  const targets = ["assets", "master", "pages", "scripts", "test"];
  for (const t of targets) {
    const src = path.join(ROOT, t);
    const dest = path.join(backupRoot, t);
    if (fs.existsSync(src)) copyDir(src, dest);
  }

  log("backup", { label, backupRoot });
  console.log(`✔ Backup created at: ${backupRoot}`);
}

// Build a meaningful site map
export function buildSiteMap() {
  const pagesDir = path.join(ROOT, "pages");
  const scriptsDir = path.join(ROOT, "scripts");
  const assetsDir = path.join(ROOT, "assets");

  const pages = fs.existsSync(pagesDir)
    ? fs.readdirSync(pagesDir).filter(f => f.endsWith(".html"))
    : [];

  const scripts = fs.existsSync(scriptsDir)
    ? fs.readdirSync(scriptsDir).filter(f => f.endsWith(".js"))
    : [];

  const assets = fs.existsSync(assetsDir)
    ? fs.readdirSync(assetsDir)
    : [];

  const map = {
    pages: pages.map(f => `pages/${f}`),
    scripts: scripts.map(f => `scripts/${f}`),
    assets: assets.map(f => `assets/${f}`)
  };

  log("sitemap", { counts: {
    pages: map.pages.length,
    scripts: map.scripts.length,
    assets: map.assets.length
  }});

  console.log("✔ Site map:");
  console.log(JSON.stringify(map, null, 2));
}

// Detect redundant folders
export function detectRedundancy() {
  const known = new Set(["assets", "master", "pages", "scripts", "test", "backups", "logs"]);
  const dirs = fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);

  const redundant = dirs.filter(d => !known.has(d));

  log("redundancy-check", { redundant });

  if (redundant.length === 0) {
    console.log("✔ No redundant folders found.");
  } else {
    console.log("⚠ Redundant folders detected:");
    redundant.forEach(d => console.log(" -", d));
  }
}

// Log actions
function log(type, data) {
  ensureDirs();
  const file = path.join(LOGS_DIR, "changes.log");
  const line = JSON.stringify({ at: new Date().toISOString(), type, data });
  fs.appendFileSync(file, line + "\n");
}

// CLI interface
const cmd = process.argv[2];

switch (cmd) {
  case "backup":
    createBackup("manual");
    break;

  case "sitemap":
    buildSiteMap();
    break;

  case "redundancy":
    detectRedundancy();
    break;

  default:
    console.log("CROWN Site Manager");
    console.log("Usage:");
    console.log("  node manager.mjs backup       → create full backup");
    console.log("  node manager.mjs sitemap      → list pages, scripts, assets");
    console.log("  node manager.mjs redundancy   → detect redundant folders");
    break;
}
function classifyFile(fullPath, relPath) {
  const stats = fs.statSync(fullPath);

  // RED — broken or unreadable
  if (stats.size === 0) return "RED";
  if (!fs.existsSync(fullPath)) return "RED";

  // AMBER — suspicious or redundant
  const redundantFolders = ["tools", "scanner-v3", "dashboard-control", "gr3-auto-fix", "gr4-cleanup", "mother"];
  if (redundantFolders.some(f => relPath.startsWith(f))) return "AMBER";

  const ext = path.extname(fullPath).toLowerCase();
  const allowed = [".html", ".css", ".js", ".png", ".jpg", ".jpeg", ".svg", ".gif", ".webp"];
  if (!allowed.includes(ext)) return "AMBER";

  // GREEN — normal
  return "GREEN";
}
