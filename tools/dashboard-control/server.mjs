#!/usr/bin/env node
import http from "http";
import fs from "fs";
import path from "path";

// Import GR3 + GR4 engines
import { runAutoFix, undoLastFix } from "../gr3-auto-fix/gr3-auto-fix.mjs";
import { runCleanup, cleanupReports } from "../gr4-cleanup/gr4-cleanup.mjs";

// PROJECT ROOT
const PROJECT_ROOT = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "../../"
);

// Reports directory in project root
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

    // GET /latest-report
    if (req.url === "/latest-report" && req.method === "GET") {
      const report = getLatestReport();
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(report));
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

    // POST /cleanup-reports (stub)
    if (req.url === "/cleanup-reports" && req.method === "POST") {
      const result = cleanupReports();
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
