#!/usr/bin/env node
import http from "http";
import url from "url";
import fs from "fs";
import path from "path";
import { runCleanup, cleanupReports } from "../gr4-cleanup/gr4-cleanup.mjs";
import { runAutoFix } from "../gr3-auto-fix/gr3-auto-fix.mjs";
import { spawn } from "child_process";

const PORT = 7777;
const REPORTS_DIR = path.resolve("./reports");

function getLatestReportPath() {
  if (!fs.existsSync(REPORTS_DIR)) throw new Error("reports directory not found");
  const files = fs.readdirSync(REPORTS_DIR)
    .filter(f => f.startsWith("scan-") && f.endsWith(".json"))
    .sort();
  if (!files.length) throw new Error("no scan-*.json reports found");
  return path.join(REPORTS_DIR, files[files.length - 1]);
}

function loadReport(reportPath) {
  return JSON.parse(fs.readFileSync(reportPath, "utf8"));
}

function listReports() {
  if (!fs.existsSync(REPORTS_DIR)) return [];
  return fs.readdirSync(REPORTS_DIR)
    .filter(f => f.startsWith("scan-") && f.endsWith(".json"))
    .sort()
    .reverse();
}

function getStorageUsage() {
  let reportsSize = 0;
  let backupsSize = 0;

  if (fs.existsSync(REPORTS_DIR)) {
    for (const f of fs.readdirSync(REPORTS_DIR)) {
      const full = path.join(REPORTS_DIR, f);
      const st = fs.statSync(full);
      reportsSize += st.size;
    }
  }

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === ".git" || e.name === "node_modules" || e.name === "reports") continue;
        walk(full);
      } else {
        if (full.endsWith(".bak") || full.endsWith(".gr3.bak")) {
          backupsSize += fs.statSync(full).size;
        }
      }
    }
  }
  walk(path.resolve("."));

  return {
    reportsSize: Math.round(reportsSize / 1024),
    backupsSize: Math.round(backupsSize / 1024),
  };
}
function runScanner() {
  return new Promise((resolve, reject) => {
    const proc = spawn("node", ["tools/scanner-v3/scanner-v3.mjs"], { shell: true });
    proc.on("exit", code => {
      if (code === 0) resolve();
      else reject(new Error("scanner exited with code " + code));
    });
  });
}

function sendJSON(res, obj) {
  const data = JSON.stringify(obj);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(data);
}

function sendError(res, status, message) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: message }));
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const { pathname, query } = parsed;

  try {
    if (pathname === "/latest-report" && req.method === "GET") {
      const p = getLatestReportPath();
      const report = loadReport(p);
      return sendJSON(res, { file: path.basename(p), report });
    }

    if (pathname === "/reports" && req.method === "GET") {
      return sendJSON(res, { files: listReports() });
    }

    if (pathname === "/report" && req.method === "GET") {
      const file = query.file;
      if (!file) return sendError(res, 400, "file required");
      const p = path.join(REPORTS_DIR, file);
      if (!fs.existsSync(p)) return sendError(res, 404, "not found");
      const report = loadReport(p);
      return sendJSON(res, { file, report });
    }

    if (pathname === "/run-scan" && req.method === "POST") {
      await runScanner();
      return sendJSON(res, { message: "Scan complete" });
    }

    if (pathname === "/run-auto-fix" && req.method === "POST") {
      const summary = await runAutoFix();
      return sendJSON(res, { summary: `fixed ${summary.fixedCount}, skipped ${summary.skipped}` });
    }

    if (pathname === "/run-cleanup" && req.method === "POST") {
      const summary = await runCleanup();
      return sendJSON(res, {
        backupsRemoved: summary.backupsRemoved,
        reportsRemoved: summary.reportsRemoved,
        keptCount: summary.backupsKept + summary.reportsKept,
      });
    }

    if (pathname === "/cleanup-reports" && req.method === "POST") {
      const r = cleanupReports();
      return sendJSON(res, { reportsRemoved: r.removed, reportsKept: r.kept });
    }

    if (pathname === "/storage-usage" && req.method === "GET") {
      return sendJSON(res, getStorageUsage());
    }

    sendError(res, 404, "not found");
  } catch (err) {
    console.error(err);
    sendError(res, 500, err.message);
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.listen(PORT, () => {
    console.log(`Dashboard control server running at http://localhost:${PORT}`);
  });
}

export default server;
