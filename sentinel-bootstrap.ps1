$ErrorActionPreference = "Stop"

$root = "C:\DEV\CROWN_CREATIVES"
$sentinelDir = Join-Path $root "sentinel"
$reactSrc = Join-Path $root "test\core-lab-react\src"

Write-Host "Creating Sentinel directory at $sentinelDir..."
New-Item -ItemType Directory -Force -Path $sentinelDir | Out-Null

Write-Host "Initializing Sentinel Node project..."
Set-Location $sentinelDir
npm init -y | Out-Null
npm install express cors node-fetch@3 --save | Out-Null

Write-Host "Writing sentinel.config.json..."
@"
{
  "devUrl": "http://localhost:5174",
  "prodUrl": "https://www.crowncreatives.uk",
  "snapshotPath": "./sentinel-snapshots",
  "timeoutMs": 5000
}
"@ | Set-Content (Join-Path $sentinelDir "sentinel.config.json")

Write-Host "Creating snapshot directory..."
New-Item -ItemType Directory -Force -Path (Join-Path $sentinelDir "sentinel-snapshots") | Out-Null

Write-Host "Writing Sentinel server (index.js)..."
@"
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const configPath = path.join(process.cwd(), 'sentinel', 'sentinel.config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

function nowIso() {
  return new Date().toISOString();
}

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

// Sentinel JSON schema (high-level)
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

// One-button endpoint: snapshot + compare + handshake
app.get('/sentinel/handshake', async (req, res) => {
  const timestamp = nowIso();

  const dev = await safeFetch(config.devUrl);
  const prod = await safeFetch(config.prodUrl);

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

  const fileName = `sentinel-${timestamp.replace(/[:]/g, '_')}.json`;
  const filePath = path.join(process.cwd(), 'sentinel-snapshots', fileName);
  fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2), 'utf-8');

  res.json(snapshot);
});

// Simple status endpoints
app.get('/sentinel/status', async (req, res) => {
  const dev = await safeFetch(config.devUrl);
  const prod = await safeFetch(config.prodUrl);

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

const port = 5175;
app.listen(port, () => {
  console.log(`[Sentinel] Listening on http://localhost:\${port}`);
  console.log(`[Sentinel] Dev: \${config.devUrl}`);
  console.log(`[Sentinel] Prod: \${config.prodUrl}`);
});
"@ | Set-Content (Join-Path $sentinelDir "index.js")

Write-Host "Writing Sentinel React hook..."
New-Item -ItemType Directory -Force -Path (Join-Path $reactSrc "sentinel") | Out-Null

@"
import { useEffect, useState } from 'react';

export function useSentinelStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5175/sentinel/status');
      const json = await res.json();
      setStatus(json);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return { status, loading, error, refresh };
}

export async function triggerSentinelHandshake() {
  const res = await fetch('http://localhost:5175/sentinel/handshake');
  return await res.json();
}
"@ | Set-Content (Join-Path $reactSrc "sentinel\useSentinel.ts")

Write-Host "Writing Sentinel UI panel..."
@"
import React, { useState } from 'react';
import { useSentinelStatus, triggerSentinelHandshake } from './useSentinel';

export function SentinelPanel() {
  const { status, loading, error, refresh } = useSentinelStatus();
  const [handshakeResult, setHandshakeResult] = useState(null);
  const [handshakeLoading, setHandshakeLoading] = useState(false);

  async function handleHandshake() {
    setHandshakeLoading(true);
    try {
      const result = await triggerSentinelHandshake();
      setHandshakeResult(result);
    } catch (err) {
      console.error('Sentinel handshake error', err);
    } finally {
      setHandshakeLoading(false);
      refresh();
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        padding: '12px 16px',
        borderRadius: 12,
        background: 'rgba(10, 10, 20, 0.9)',
        color: '#fff',
        fontSize: 12,
        zIndex: 99999,
        boxShadow: '0 0 18px rgba(0, 200, 255, 0.6)'
      }}
    >
      <div style={{ marginBottom: 8, fontWeight: 'bold', letterSpacing: '0.08em' }}>
        SENTINEL WATCHKEEPER
      </div>

      {loading ? (
        <div>Loading status…</div>
      ) : error ? (
        <div style={{ color: '#ff8080' }}>Error: {String(error)}</div>
      ) : status ? (
        <div style={{ marginBottom: 8 }}>
          <div>Dev: {status.dev.status} ({status.dev.durationMs} ms)</div>
          <div>Prod: {status.prod.status} ({status.prod.durationMs} ms)</div>
        </div>
      ) : (
        <div>No status yet.</div>
      )}

      <button
        onClick={handleHandshake}
        disabled={handshakeLoading}
        style={{
          marginTop: 6,
          padding: '6px 10px',
          borderRadius: 8,
          border: 'none',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #00c9ff, #7f00ff)',
          color: '#fff',
          fontSize: 11,
          letterSpacing: '0.08em'
        }}
      >
        {handshakeLoading ? 'RUNNING SENTINEL…' : 'RUN SENTINEL HANDSHAKE'}
      </button>

      {handshakeResult && (
        <div style={{ marginTop: 8, maxHeight: 160, overflow: 'auto', fontSize: 10 }}>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(handshakeResult.compare, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
"@ | Set-Content (Join-Path $reactSrc "sentinel\SentinelPanel.tsx")

Write-Host "Sentinel bootstrap complete."
Write-Host "1) Run:  node C:\DEV\CROWN_CREATIVES\sentinel\index.js"
Write-Host "2) Import <SentinelPanel /> into your React app root."
