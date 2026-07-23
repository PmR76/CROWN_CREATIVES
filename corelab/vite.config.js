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

  // ------------------------------------------------------------
  // ROOT CONFIG (CRITICAL FIX)
  // ------------------------------------------------------------
  root: ".",              // ⭐ Forces Vite to use /corelab as project root
  publicDir: "public",    // ⭐ Ensures correct index.html is used

  // ------------------------------------------------------------
  // SERVER CONFIG (DEV ONLY)
  // ------------------------------------------------------------
  server: {
    port: detectVitePort(),
    strictPort: false,
    fs: {
      strict: false
    }
  },

  plugins: [
    react(),

    // ------------------------------------------------------------
    // Sentinel Manifest Scan Endpoint (Dev Only)
    // ------------------------------------------------------------
    {
      name: "sentinel-manifest-scan-endpoint",
      apply: "serve",
      configureServer(server) {
        server.middlewares.use("/sentinel-scan", async (req, res) => {
          try {
            const results = runSentinelManifestScanner();
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(results));
          } catch (err) {
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                error: "Sentinel scan failed",
                detail: err.message
              })
            );
          }
        });
      }
    }
  ],

  // ------------------------------------------------------------
  // BUILD CONFIG (Cloudflare Pages Safe)
  // ------------------------------------------------------------
  build: {
    copyPublicDir: true,
    sourcemap: true,
    emptyOutDir: true
  }
});
