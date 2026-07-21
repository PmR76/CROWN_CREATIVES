// ============================================================
// vite.config.js — Core Lab Runtime Config (GR1 Stable)
// ============================================================

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dynamic port resolver
import { detectVitePort } from "./vite-port.js";

// Sentinel manifest scanner
import { runSentinelManifestScanner } from "./sentinel/SentinelManifestScanner.js";

export default defineConfig({
  server: {
    port: detectVitePort(),
    strictPort: false,          // Prevent hard failures if port is taken
    fs: {
      strict: false             // Allow scanning outside /corelab for Sentinel
    }
  },

  plugins: [
    react(),

    // ------------------------------------------------------------
    // Sentinel Manifest Scan Endpoint (Dev Only)
    // ------------------------------------------------------------
    {
      name: "sentinel-manifest-scan-endpoint",
      apply: "serve",            // Prevent running during build
      configureServer(server) {
        server.middlewares.use("/sentinel-scan", async (req, res) => {
          try {
            const results = runSentinelManifestScanner();
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(results));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Sentinel scan failed", detail: err.message }));
          }
        });
      }
    }
  ],

  // ------------------------------------------------------------
  // BUILD CONFIG
  // ------------------------------------------------------------
  build: {
    copyPublicDir: true,
    sourcemap: true,             // Helps diagnose white-screen issues
    emptyOutDir: true            // Prevent stale build artifacts
  }
});
