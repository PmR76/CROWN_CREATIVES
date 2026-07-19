const fs = require("fs");
const path = require("path");

// 🔥 REMOVED config.json dependency
// 🔥 Replaced with explicit, safe configuration
const TARGETS = [
  // Public folder (main site)
  path.resolve(__dirname, "../public/manifests")
];

const SOURCE_DIR = path.resolve(__dirname, "../public/sounds");
const OUTPUT_NAME = "sound-manifest.json";

function buildManifest() {
  // Collect all .mp3 files
  const files = fs.readdirSync(SOURCE_DIR)
    .filter(f => f.toLowerCase().endsWith(".mp3"));

  const manifest = { tracks: files };
  const json = JSON.stringify(manifest, null, 2);

  // Write manifest to each target
  TARGETS.forEach(target => {
    const outPath = path.join(target, OUTPUT_NAME);

    console.log("Writing sound manifest to:", outPath);

    // Ensure folder exists
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }

    fs.writeFileSync(outPath, json);
  });
}

buildManifest();
