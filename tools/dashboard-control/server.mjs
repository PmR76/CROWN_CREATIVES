#!/usr/bin/env node
import http from "http";
import fs from "fs";
import path from "path";
import url from "url";

// GR1/GR2 scanner
import { runScan } from "../scanner-v3/scanner-v3.mjs";

// GR3 + GR4 engines
import { runAutoFix, undoLastFix } from "../gr3-auto-fix/gr3-auto-fix.mjs";
import { runCleanup, cleanupReports } from "../gr4-cleanup/gr4-cleanup.mjs";

// PROJECT ROOT (Windows‑safe)
const PROJECT_ROOT = path.resolve(
  path.dirname(new URL(import.meta.url).pathname).replace(/^\/+/, ""),
  "../../"
);

// PUBLIC DIRECTORY (for dashboard UI)
const PUBLIC_DIR = path.join(
  path.dirname(new URL(import.meta.url).pathname).replace(/^\/+/, ""),
  "public"
);

// REPORTS + BACKUPS
const REPORTS_DIR = path.join(PROJECT_ROOT, "reports");
const BACKUPS_DIR = path.join(PROJECT_ROOT, "backups");

// Utility: get latest scan report
function getLatestReport() {
  if (!fs.existsSync(REPORTS_DIR)) throw new Error("Reports directory not found");

  const files = fs.readdirSync(REPORTS_DIR)
    .filter(f => f.startsWith("scan-") && f.endsWith(".json"))
    .sort();

  if (!files.length) throw new Error("No scan reports found");

  const latest = files[files.length - 1];
  return JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, latest), "utf8"));
}

// Utility: list report files
function listReportFiles() {
  if (!fs.existsSync(REPORTS_DIR)) return [];
  return fs.readdirSync(REPORTS_DIR)
    .filter(f => f.startsWith("scan-") && f.endsWith(".json"))
    .sort()
    .reverse();
}

// Utility: load specific report
function getReportByFile(filename) {
  const full = path.join(REPORTS_DIR, filename);
  if (!fs.existsSync(full)) throw new Error("Report not found: " + filename);
  return JSON.parse(fs.readFileSync(full, "utf8"));
}

// Utility: compute directory size in KB
function getDirSizeKB(dir) {
  if (!fs.existsSync(dir)) return 0;
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isFile()) total += fs.statSync(full).size;
    else if (entry.isDirectory()) total += getDirSizeKB(full) * 1024;
  }
  return Math.round(total / 1024);
}

// Utility: read JSON body
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => data += chunk);
    req.on("end", () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); }
      catch (err) { reject(err); }
    });
    req.on("error", reject);
  });
}

// Serve static files
function serveStatic(req, res) {
  let filePath = req.url === "/"
    ? path.join(PUBLIC_DIR, "index.html")
    : path.join(PUBLIC_DIR, req.url);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const types = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "application/javascript",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".svg": "image/svg+xml",
      ".ico": "image/x-icon"
    };
    res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
    return res.end(fs.readFileSync(filePath));
  }

  return false;
}

// Create server
const server = http.createServer(async (req, res) => {

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  const parsed = url.parse(req.url, true);
  const { pathname, query } = parsed;

  try {
    // 1. Static files
    const served = serveStatic(req, res);
    if (served !== false) return;

    // 2. API ROUTES

    // GET /latest-report
    if (pathname === "/latest-report" && req.method === "GET") {
      const report = getLatestReport();
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ report }));
    }

    // GET /reports
    if (pathname === "/reports" && req.method === "GET") {
      const files = listReportFiles();
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ files }));
    }

    // GET /report?file=...
    if (pathname === "/report" && req.method === "GET") {
      const file = query.file;
      if (!file) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Missing file parameter" }));
      }
      const report = getReportByFile(file);
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ report }));
    }

    // GET /storage-usage
    if (pathname === "/storage-usage" && req.method === "GET") {
      const reportsSize = getDirSizeKB(REPORTS_DIR);
      const backupsSize = getDirSizeKB(BACKUPS_DIR);
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ reportsSize, backupsSize }));
    }

    // POST /run-scan
    if (pathname === "/run-scan" && req.method === "POST") {
      try {
        const result = await runScan();
        const message = result?.message || "Scan complete.";
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message, result }));
      } catch (err) {
        console.error("SCAN ERROR:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
          error: true,
          message: "Scanner crashed",
          details: err.message
        }));
      }
    }

    // POST /run-auto-fix
    if (pathname === "/run-auto-fix" && req.method === "POST") {
      const body = await readJsonBody(req).catch(() => ({}));
      const mode = body.mode || "safe";
      const dryRun = !!body.dryRun;
      const summary = await runAutoFix({ mode, dryRun });
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ summary }));
    }

    // POST /run-auto-fix-dry
    if (pathname === "/run-auto-fix-dry" && req.method === "POST") {
      const summary = await runAutoFix({ mode: "safe", dryRun: true });
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ summary }));
    }

    // POST /undo-last-fix
    if (pathname === "/undo-last-fix" && req.method === "POST") {
      const result = await undoLastFix();
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ result }));
    }

    // POST /run-cleanup
    if (pathname === "/run-cleanup" && req.method === "POST") {
      const result = await runCleanup();
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(result));
    }

    // POST /cleanup-reports
    if (pathname === "/cleanup-reports" && req.method === "POST") {
      const result = await cleanupReports();
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(result));
    }

    // Fallback
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));

  } catch (err) {
    console.error("Server error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
});

// Start server
const PORT = 7777;
server.listen(PORT, () => {
  console.log(`Dashboard Control Server running on port ${PORT}`);
});
