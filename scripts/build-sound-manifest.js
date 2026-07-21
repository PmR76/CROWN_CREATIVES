const fs = require("fs");
const path = require("path");

// Corrected paths for new project structure
// Cloudflare build root: /opt/buildhome/repo/
// Local build root: C:\DEV\CROWN_CREATIVES\
const ROOT = fs.existsSync(path.resolve(__dirname, "../corelab"))
  ? path.resolve(__dirname, "../corelab")
  : path.resolve(__dirname, "..");

// SOURCE: corelab/public/sounds
const SOURCE_DIR = path.join(ROOT, "public/sounds");

// TARGET: corelab/public/manifests
const TARGETS = [
  path.join(ROOT, "public/manifests")
];

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
