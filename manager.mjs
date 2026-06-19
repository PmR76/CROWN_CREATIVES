#!/usr/bin/env node
import fs from "fs";
import path from "path";

// ------------------------------------------------------------
// ROOT + DIRECTORIES
// ------------------------------------------------------------
const ROOT = path.resolve(".");
const BACKUPS_DIR = path.join(ROOT, "backups");
const LOGS_DIR = path.join(ROOT, "logs");

// ------------------------------------------------------------
// UTILITIES
// ------------------------------------------------------------
function ensureDirs() {
  for (const dir of [BACKUPS_DIR, LOGS_DIR]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function writeJsonLog(command, data) {
  ensureDirs();
  const stamp = timestamp();
  const file = path.join(LOGS_DIR, `${stamp}-${command}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function log(type, data) {
  ensureDirs();
  const file = path.join(LOGS_DIR, "changes.log");
  const line = JSON.stringify({ at: new Date().toISOString(), type, data });
  fs.appendFileSync(file, line + "\n");
}

// ------------------------------------------------------------
// BACKUP
// ------------------------------------------------------------
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
  writeJsonLog("backup", { backupRoot, label });

  console.log(`✔ Backup created at: ${backupRoot}`);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

// ------------------------------------------------------------
// SITEMAP
// ------------------------------------------------------------
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

  log("sitemap", map);
  writeJsonLog("sitemap", map);

  console.log("✔ Site map:");
  console.log(JSON.stringify(map, null, 2));
}

// ------------------------------------------------------------
// REDUNDANCY CHECK
// ------------------------------------------------------------
export function detectRedundancy() {
  const known = new Set(["assets", "master", "pages", "scripts", "test", "backups", "logs"]);
  const dirs = fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);

  const redundant = dirs.filter(d => !known.has(d));

  log("redundancy-check", { redundant });
  writeJsonLog("redundancy", { redundant });

  if (redundant.length === 0) {
    console.log("✔ No redundant folders found.");
  } else {
    console.log("⚠ Redundant folders detected:");
    redundant.forEach(d => console.log(" -", d));
  }
}

// ------------------------------------------------------------
// FILE CLASSIFIER (GREEN / AMBER / RED)
// ------------------------------------------------------------
function classifyFile(fullPath, relPath) {
  const stats = fs.statSync(fullPath);

  if (stats.size === 0) return "RED";
  if (!fs.existsSync(fullPath)) return "RED";

  const redundantFolders = ["tools", "scanner-v3", "dashboard-control", "gr3-auto-fix", "gr4-cleanup", "mother"];
  if (redundantFolders.some(f => relPath.startsWith(f))) return "AMBER";

  const ext = path.extname(fullPath).toLowerCase();
  const allowed = [".html", ".css", ".js", ".png", ".jpg", ".jpeg", ".svg", ".gif", ".webp"];
  if (!allowed.includes(ext)) return "AMBER";

  return "GREEN";
}

// ------------------------------------------------------------
// FILE TREE
// ------------------------------------------------------------
export function buildFileTree() {
  const important = ["assets", "master", "pages", "scripts", "test"];
  const tree = {};

  function walk(dir, prefix = "") {
    let output = "";
    const full = path.join(ROOT, dir);

    if (!fs.existsSync(full)) return "";

    const entries = fs.readdirSync(full, { withFileTypes: true })
      .filter(e => !e.name.startsWith("."))
      .sort((a, b) => a.name.localeCompare(b.name));

    tree[dir] = tree[dir] || [];

    for (const entry of entries) {
      const rel = path.join(dir, entry.name);
      const fullPath = path.join(ROOT, rel);

      if (entry.isDirectory()) {
        tree[dir].push({ type: "folder", name: entry.name });
        output += `${prefix}📁 ${entry.name}\n`;
        output += walk(rel, prefix + "   ");
      } else {
        const status = classifyFile(fullPath, rel);
        const marker =
          status === "GREEN" ? "🟢" :
          status === "AMBER" ? "🟠" :
          "🔴";

        tree[dir].push({ type: "file", name: entry.name, status });
        output += `${prefix}${marker} ${entry.name}\n`;
      }
    }

    return output;
  }

  console.log("✔ Important File Tree:\n");

  for (const folder of important) {
    console.log(`\n=== ${folder.toUpperCase()} ===`);
    console.log(walk(folder));
  }

  writeJsonLog("filetree", tree);
  log("filetree", { folders: important });
}

// ------------------------------------------------------------
// MISSING PAGE DEPENDENCIES (G)
// ------------------------------------------------------------
export function detectMissingDependencies() {
  const pagesDir = path.join(ROOT, "pages");
  const scriptsDir = path.join(ROOT, "scripts");
  const assetsDir = path.join(ROOT, "assets");

  const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith(".html"));
  const scripts = fs.readdirSync(scriptsDir).filter(f => f.endsWith(".js"));
  const assets = fs.readdirSync(assetsDir);

  const report = [];

  for (const page of pages) {
    const full = path.join(pagesDir, page);
    const html = fs.readFileSync(full, "utf8");

    const missing = {
      page,
      missingScripts: [],
      missingAssets: [],
      brokenLinks: []
    };

    for (const script of scripts) {
      if (!html.includes(script)) missing.missingScripts.push(script);
    }

    for (const asset of assets) {
      if (!html.includes(asset)) missing.missingAssets.push(asset);
    }

    const linkRegex = /href="([^"]+)"/g;
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      const target = match[1];
      if (target.endsWith(".html")) {
        const targetPath = path.join(pagesDir, target);
        if (!fs.existsSync(targetPath)) missing.brokenLinks.push(target);
      }
    }

    report.push(missing);
  }

  console.log("✔ Missing Page Dependencies:\n");
  for (const r of report) {
    console.log(r.page);
    if (r.missingScripts.length) console.log(" - missing scripts:", r.missingScripts.join(", "));
    if (r.missingAssets.length) console.log(" - missing assets:", r.missingAssets.join(", "));
    if (r.brokenLinks.length) console.log(" - broken links:", r.brokenLinks.join(", "));
    console.log("");
  }

  writeJsonLog("missing", report);
  log("missing-dependencies", { count: report.length });
}

// ------------------------------------------------------------
// CLI INTERFACE
// ------------------------------------------------------------
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

  case "filetree":
    buildFileTree();
    break;

  case "missing":
    detectMissingDependencies();
    break;

  default:
    console.log("CROWN Site Manager");
    console.log("Usage:");
    console.log("  node manager.mjs backup       → create full backup");
    console.log("  node manager.mjs sitemap      → list pages, scripts, assets");
    console.log("  node manager.mjs redundancy   → detect redundant folders");
    console.log("  node manager.mjs filetree     → show important file tree");
    console.log("  node manager.mjs missing      → detect missing page dependencies");
    break;
}
