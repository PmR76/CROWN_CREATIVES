// ============================================================
// vite-port.js — Safe Dynamic Port Resolver (GR1 Stable)
// ============================================================

import fs from "fs";
import path from "path";

const PORT_FILE = path.join(process.cwd(), "sentinel", "sentinel.config.json");

export function detectVitePort() {
  try {
    if (!fs.existsSync(PORT_FILE)) {
      return 5173;
    }

    const raw = fs.readFileSync(PORT_FILE, "utf-8");
    const config = JSON.parse(raw);

    const port = Number(config.devPort);
    return port > 0 ? port : 5173;
  } catch {
    return 5173;
  }
}
