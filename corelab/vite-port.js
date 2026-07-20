// vite-port.js
import fs from "fs";
import path from "path";

const PORT_FILE = path.join(process.cwd(), "sentinel", "sentinel.config.json");

export function detectVitePort() {
  try {
    const config = JSON.parse(fs.readFileSync(PORT_FILE, "utf-8"));
    return config.devPort || 5173;
  } catch (err) {
    return 5173;
  }
}
