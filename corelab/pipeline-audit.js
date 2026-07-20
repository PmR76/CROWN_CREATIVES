import fs from "fs";
import path from "path";
import http from "http";

const ROOT = "C:/DEV/CROWN_CREATIVES/corelab";

function checkFile(p) {
  return fs.existsSync(path.join(ROOT, p));
}

function log(ok, msg) {
  console.log(ok ? `✔ ${msg}` : `❌ ${msg}`);
}

async function checkUrl(url) {
  return new Promise(resolve => {
    http.get(url, res => resolve(res.statusCode));
  }).catch(() => 0);
}

async function runAudit() {
  console.log("=== CORELAB PIPELINE AUDIT ===\n");

  // 1. Root integrity
  log(fs.existsSync(ROOT), "Project root exists");

  // 2. Vite config
  log(checkFile("vite.config.js"), "vite.config.js exists");

  // 3. Public folder
  log(checkFile("public/index.html"), "public/index.html exists");

  // 4. Source folder
  log(checkFile("src/main.jsx"), "src/main.jsx exists");

  // 5. Node modules
  log(checkFile("node_modules"), "node_modules exists");

  // 6. Vite dev server
  console.log("\nChecking Vite dev server...");
  const devStatus = await checkUrl("http://localhost:5173");
  log(devStatus === 200, `localhost:5173 responded with status ${devStatus}`);

  // 7. Sentinel
  console.log("\nChecking Sentinel...");
  const sentinelStatus = await checkUrl("http://localhost:5175/sentinel/status");
  log(sentinelStatus === 200, `Sentinel responded with status ${sentinelStatus}`);

  console.log("\n=== AUDIT COMPLETE ===");
}

runAudit();
