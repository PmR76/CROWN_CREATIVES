const fs = require("fs");
const path = require("path");

// No config.json dependency
const TARGETS = [
  path.resolve(__dirname, "../public/manifests")
];

const SOURCE_DIR = path.resolve(__dirname, "../public/sounds");
const OUTPUT_NAME = "sound-manifest.json";

function buildManifest() {
  const files = fs.readdirSync(SOURCE_DIR)
    .filter(f => f.toLowerCase().endsWith(".mp3"));

  const manifest = { tracks: files };
  const json = JSON.stringify(manifest, null, 2);

  TARGETS.forEach(target => {
    const outPath = path.join(target, OUTPUT_NAME);

    console.log("Writing sound manifest to:", outPath);

    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }

    fs.writeFileSync(outPath, json);
  });
}

buildManifest();
