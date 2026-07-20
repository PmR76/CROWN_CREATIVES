import { detectVitePort } from "./vite-port.js";
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import fs, { readdirSync, statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CloudflareProfile } from "./profiles/cloudflare.js";

const app = express();
app.use(cors());
app.use(express.json());

// Resolve correct directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load config
const configPath = path.join(__dirname, "sentinel.config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

// AUTO‑DETECT VITE PORT (GR1 PATCH)
const devUrl = detectVitePort();
const prodUrl = config.prodUrl;

// Timestamp helper
function nowIso() {
  return new Date().toISOString();
}

// Safe fetch wrapper
async function safeFetch(url) {
  const start = Date.now();
  try {
    const res = await fetch(url, { timeout: config.timeoutMs });
    const text = await res.text();
    return {
      ok: res.ok,
      status: res.status,
      url,
      durationMs: Date.now() - start,
      bodyLength: text.length,
      body: text
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      url,
      durationMs: Date.now() - start,
      error: String(err)
    };
  }
}

// Sentinel schema
const sentinelSchema = {
  version: "1.0.0",
  fields: {
    env: "dev|prod",
    route: "string",
    url: "string",
    status: "number",
    ok: "boolean",
    durationMs: "number",
    bodyLength: "number",
    errors: "array",
    timestamp: "string"
  }
};

// HANDSHAKE
app.get("/sentinel/handshake", async (req, res) => {
  const timestamp = nowIso();
  const dev = await safeFetch(devUrl);
  const prod = await safeFetch(prodUrl);

  const snapshot = {
    schema: sentinelSchema,
    timestamp,
    dev: {
      env: "dev",
      url: dev.url,
      status: dev.status,
      ok: dev.ok,
      durationMs: dev.durationMs,
      bodyLength: dev.bodyLength,
      error: dev.error || null
    },
    prod: {
      env: "prod",
      url: prod.url,
      status: prod.status,
      ok: prod.ok,
      durationMs: prod.durationMs,
      bodyLength: prod.bodyLength,
      error: prod.error || null
    },
    compare: {
      statusMatch: dev.status === prod.status,
      okMatch: dev.ok === prod.ok,
      bodySizeDelta: dev.bodyLength - prod.bodyLength
    }
  };

  const cloudflareIssues = CloudflareProfile.diagnose(prod);
  snapshot.cloudflare = cloudflareIssues;

  const fileName = `sentinel-${timestamp.replace(/[:]/g, "_")}.json`;
  const filePath = path.join(process.cwd(), "sentinel-snapshots", fileName);
  fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2), "utf-8");

  res.json(snapshot);
});

// STATUS
app.get("/sentinel/status", async (req, res) => {
  const dev = await safeFetch(devUrl);
  const prod = await safeFetch(prodUrl);

  res.json({
    timestamp: nowIso(),
    dev: {
      url: dev.url,
      status: dev.status,
      ok: dev.ok,
      durationMs: dev.durationMs,
      bodyLength: dev.bodyLength,
      error: dev.error || null
    },
    prod: {
      url: prod.url,
      status: prod.status,
      ok: prod.ok,
      durationMs: prod.durationMs,
      bodyLength: prod.bodyLength,
      error: prod.error || null
    }
  });
});

// FILE TREE ENDPOINT
function walk(dir) {
  const result = [];
  const list = readdirSync(dir);

  for (const file of list) {
    const full = path.join(dir, file);
    const stat = statSync(full);

    result.push({
      name: file,
      path: full,
      type: stat.isDirectory() ? "directory" : "file",
      children: stat.isDirectory() ? walk(full) : []
    });
  }

  return result;
}

app.get("/sentinel/filetree", (req, res) => {
 const root = path.join(__dirname, ".."); // FIXED ROOT
  const tree = walk(root);
  res.json(tree);
});

// SERVER
const port = 5175;
app.listen(port, () => {
  console.log(`[Sentinel] Listening on http://localhost:${port}`);
  console.log(`[Sentinel] Dev (auto): ${devUrl}`);
  console.log(`[Sentinel] Prod: ${prodUrl}`);
});
