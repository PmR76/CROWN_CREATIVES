import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { exec } from "child_process";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "build-manifests",
      configureServer() {
        exec("node ./scripts/build-manifests.js");
      }
    }
  ]
});
