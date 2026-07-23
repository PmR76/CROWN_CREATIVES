import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { detectVitePort } from "./vite-port.js";
import { runSentinelManifestScanner } from "./sentinel/SentinelManifestScanner.js";

export default defineConfig({
  root: ".",   // Cloudflare v2 root strategy

  server: {
    port: detectVitePort(),
    strictPort: false,
    fs: { strict: false }
  },

  plugins: [
    react(),
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
            res.end(JSON.stringify({ error: "Sentinel scan failed", detail: err.message }));
          }
        });
      }
    }
  ],

  build: {
    copyPublicDir: true,
    sourcemap: true,
    emptyOutDir: true
  }
});
