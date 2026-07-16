import fs from "fs";
import path from "path";

export function detectVitePort() {
  const logPath = path.join(
    "C:\\DEV\\CROWN_CREATIVES\\test\\core-lab-react",
    "vite-port.log"
  );

  try {
    const port = fs.readFileSync(logPath, "utf-8").trim();
    return `http://localhost:${port}`;
  } catch {
    return "http://localhost:5173";
  }
}
