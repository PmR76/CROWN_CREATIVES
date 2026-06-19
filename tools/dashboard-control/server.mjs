#!/usr/bin/env node
import http from "http";
import fs from "fs";
import path from "path";

// Import GR3 + GR4 engines
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

// REPORTS DIRECTORY
const REPORTS_DIR = path.join(PROJECT_ROOT, "reports");

// Utility: get latest scan report
function getLatestReport() {
  if (!fs.existsSync(REPORTS_DIR)) {
    throw new Error("Reports directory not found");
  }

  const files = fs.readdirSync(REPORTS_DIR)
    .filter(f => f.startsWith("scan-") && f.endsWith(".json"))
    .sort();

  if (!files.length) {
    throw new Error("No scan reports found");
  }

  const latest = files[files.length - 1];
  const fullPath = path.join(REPORTS_DIR, latest);

  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

// Serve static files
function serveStatic(req, res) {
  let filePath = req.url === "/" 
    ? path.join(PUBLIC_DIR, "index.html")
    : path.join(PUBLIC_DIR, req.url);

  // Prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  // If file exists, serve it
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

  return false; // not a static file
}

// Create server
const server = http.createServer(async (req, res) => {

  // --- CORS HEADERS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  try {
    // 1. Try static files first
    const served = serveStatic(req, res);
    if (served !== false) return;

    // 2. API ROUTES

    // GET /latest-report
    if (req.url === "/latest-report" && req.method === "GET") {
      const report = getLatestReport();
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ report }));
    }

    // POST /auto-fix
    if (req.url === "/auto-fix" && req.method === "POST") {
      const summary = await runAutoFix();
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(summary));
    }

    // POST /undo
    if (req.url === "/undo" && req.method === "POST") {
      const result = undoLastFix();
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(result));
    }

    // POST /cleanup
    if (req.url === "/cleanup" && req.method === "POST") {
      const result = runCleanup();
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(result));
    }

    // POST /cleanup-reports
    if (req.url === "/cleanup-reports" && req.method === "POST") {
      const result = cleanupReports();
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(result));
    }

    // 404 fallback
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
