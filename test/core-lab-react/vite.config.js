import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
server: {
  host: "192.168.0.23",
  port: 3000,
  strictPort: true
}

});
