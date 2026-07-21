import fs from "fs";
import path from "path";

// Detect whether Cloudflare is running from repo root or corelab/
const ROOT = fs.existsSync(path.join(process.cwd(), "corelab"))
  ? path.join(process.cwd(), "corelab")
  : process.cwd();

function checkFolder(relativePath) {
  const fullPath = path.join(ROOT, relativePath);

  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing required folder: ${relativePath}`);
    process.exit(1);
  } else {
    console.log(`✔ Found: ${relativePath}`);
  }
}

console.log("🔍 Verifying required folders...");

[
  "public/assets/images/gallery",
  "public/sounds"
].forEach(checkFolder);

console.log("✔ Folder verification complete");
