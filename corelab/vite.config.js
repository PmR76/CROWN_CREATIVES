import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { detectVitePort } from "./vite-port.js";
import { runSentinelManifestScanner } from "./sentinel/SentinelManifestScanner.js";

export default defineConfig({
  server: {
    port: detectVitePort()
  },
  plugins: [
    react(),
    {
      name: "sentinel-manifest-scan-endpoint",
      configureServer(server) {
        server.middlewares.use("/sentinel-scan", async (req, res) => {
          const results = runSentinelManifestScanner();
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(results));
        });
      }
    }
  ],
  build: {
    copyPublicDir: true
  }
});
