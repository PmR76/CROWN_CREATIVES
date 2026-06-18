#!/usr/bin/env node
import fs from "fs";
import path from "path";

const REPORTS_DIR = path.resolve("./reports");
const ROOT = path.resolve(".");
const DAYS_30 = 30 * 24 * 60 * 60 * 1000;

function isKeepFile(filePath) {
  return filePath.endsWith(".keep");
}

function isOldEnough(stats, cutoff) {
  return stats.mtime.getTime() < cutoff;
}

function collectBackups(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === ".git" || e.name === "node_modules" || e.name === "reports") continue;
      collectBackups(full, list);
    } else {
      if (full.endsWith(".bak") || full.endsWith(".gr3.bak")) {
        list.push(full);
      }
    }
  }
  return list;
}

function cleanupBackups() {
  const now = Date.now();
  const cutoff = now - DAYS_30;
  const backups = collectBackups(ROOT);
  let removed = 0;
  let kept = 0;

  for (const file of backups) {
    if (isKeepFile(file)) {
      kept++;
      continue;
    }
    const stats = fs.statSync(file);
    if (isOldEnough(stats, cutoff)) {
      fs.unlinkSync(file);
      removed++;
    } else {
      kept++;
    }
  }
  return { removed, kept };
}

function cleanupReports() {
  if (!fs.existsSync(REPORTS_DIR)) return { removed: 0, kept: 0 };
  const now = Date.now();
  const cutoff = now - DAYS_30;
  const files = fs.readdirSync(REPORTS_DIR);
  let removed = 0;
  let kept = 0;

  for (const f of files) {
    const full = path.join(REPORTS_DIR, f);
    const stats = fs.statSync(full);
    if (isOldEnough(stats, cutoff)) {
      fs.unlinkSync(full);
      removed++;
    } else {
      kept++;
    }
  }
  return { removed, kept };
}

async function runCleanup() {
  const b = cleanupBackups();
  const r = cleanupReports();
  const summary = {
    backupsRemoved: b.removed,
    backupsKept: b.kept,
    reportsRemoved: r.removed,
    reportsKept: r.kept,
  };
  if (require.main === module) {
    console.log(`GR4 cleanup: backups removed ${b.removed}, kept ${b.kept}; reports removed ${r.removed}, kept ${r.kept}`);
  } else {
    return summary;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runCleanup().catch(err => {
    console.error("GR4 cleanup failed:", err);
    process.exit(1);
  });
}

export { runCleanup, cleanupReports };
