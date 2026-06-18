#!/usr/bin/env node
import fs from "fs";
import path from "path";

/* ============================================================
   GR4 CLEANUP ENGINE
   - Deletes old scan reports
   - Deletes old .gr3.bak backups
   - Keeps recent files based on config
============================================================ */

// Resolve reports directory relative to THIS file
const REPORTS_DIR = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "../scanner-v3/reports"
);

// Optional keep-config file
const KEEP_CONFIG = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "backup-keep.json"
);

/* ------------------------------------------------------------
   Load keep-config (optional)
------------------------------------------------------------ */
function loadKeepConfig() {
  if (!fs.existsSync(KEEP_CONFIG)) return { keep: [] };
  try {
    return JSON.parse(fs.readFileSync(KEEP_CONFIG, "utf8"));
  } catch {
    return { keep: [] };
  }
}

/* ------------------------------------------------------------
   Cleanup: delete old scan reports
------------------------------------------------------------ */
function cleanupOldReports() {
  if (!fs.existsSync(REPORTS_DIR)) {
    return { removed: 0, kept: 0, reason: "reports directory missing" };
  }

  const files = fs.readdirSync(REPORTS_DIR)
    .filter(f => f.startsWith("scan-") && f.endsWith(".json"))
    .sort();

  if (files.length <= 3) {
    return { removed: 0, kept: files.length, reason: "not enough reports to clean" };
  }

  const toRemove = files.slice(0, -3);
  let removed = 0;

  for (const f of toRemove) {
    const full = path.join(REPORTS_DIR, f);
    if (fs.existsSync(full)) {
      fs.unlinkSync(full);
      removed++;
    }
  }

  return { removed, kept: 3 };
}

/* ------------------------------------------------------------
   Cleanup: delete .gr3.bak backups
------------------------------------------------------------ */
function cleanupBackups() {
  const projectRoot = path.resolve(".");
  const keepConfig = loadKeepConfig();
  const backups = [];

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (["node_modules", ".git", "reports"].includes(e.name)) continue;
        walk(full);
      } else if (e.isFile() && full.endsWith(".gr3.bak")) {
        backups.push(full);
      }
    }
  }

  walk(projectRoot);

  let removed = 0;
  let kept = 0;

  for (const bak of backups) {
    const rel = bak.replace(projectRoot, "").replace(/\\/g, "/");

    if (keepConfig.keep.includes(rel)) {
      kept++;
      continue;
    }

    if (fs.existsSync(bak)) {
      fs.unlinkSync(bak);
      removed++;
    }
  }

  return { removed, kept };
}

/* ------------------------------------------------------------
   Main cleanup runner
------------------------------------------------------------ */
function runCleanup() {
  const reportCleanup = cleanupOldReports();
  const backupCleanup = cleanupBackups();

  return {
    reports: reportCleanup,
    backups: backupCleanup,
    status: "ok"
  };
}

/* ------------------------------------------------------------
   Stub for dashboard API compatibility
------------------------------------------------------------ */
function cleanupReports() {
  return {
    status: "noop",
    message: "cleanupReports() not implemented yet"
  };
}

/* ------------------------------------------------------------
   CLI entrypoint
------------------------------------------------------------ */
if (import.meta.url.endsWith("/gr4-cleanup.mjs")) {
  const result = runCleanup();
  console.log("GR4 Cleanup Complete:", result);
}

/* ------------------------------------------------------------
   Exports
------------------------------------------------------------ */
export { runCleanup, cleanupReports };
