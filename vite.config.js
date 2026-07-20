import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Correct Layer 3 path
import { runSentinelManifestScanner } from "./corelab/sentinel/SentinelManifestScanner.js";

export default defineConfig({
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
