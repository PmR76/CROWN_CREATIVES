import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 49152,
    strictPort: true,
    host: true,
    open: false   // ← DO NOT AUTO-OPEN THE WRONG PAGE
  }
});
