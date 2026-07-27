// ============================================================
// CoreLab CSS Auto-Fixer
// - Detects global keyframe collisions
// - Renames conflicting keyframes with unique names
// - Updates references inside the same file
// - Writes patched versions to /diagnostics/css-patches/
// ============================================================

import fs from "fs";
import path from "path";

const STYLES_ROOT = path.resolve("src/styles");
const PATCH_ROOT = path.resolve("src/diagnostics/css-patches");

// Ensure patch folder exists
if (!fs.existsSync(PATCH_ROOT)) {
  fs.mkdirSync(PATCH_ROOT, { recursive: true });
}

const cssFiles = [];

// Recursively collect all .css files
function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(full);
    } else if (entry.name.endsWith(".css")) {
      cssFiles.push(full);
    }
  }
}

scanDir(STYLES_ROOT);

console.log("=== CORELAB CSS AUTO-FIXER START ===");

// Keyframe names that are known to collide globally
const GLOBAL_KEYFRAMES = ["0%", "50%", "100%", "to", "from"];

// Process each CSS file
cssFiles.forEach((filePath) => {
  const original = fs.readFileSync(filePath, "utf8");
  let patched = original;
  let changed = false;

  GLOBAL_KEYFRAMES.forEach((kf) => {
    const regex = new RegExp(`@keyframes\\s+${kf}`, "g");

    if (regex.test(original)) {
      const uniqueName = `${kf.replace("%", "pct")}_${path.basename(filePath).replace(".css", "")}`;
      patched = patched.replace(regex, `@keyframes ${uniqueName}`);
      patched = patched.replace(new RegExp(`animation:\\s*${kf}`, "g"), `animation: ${uniqueName}`);
      changed = true;

      console.log(`🛠 Fixed keyframe '${kf}' in ${filePath}`);
    }
  });

  if (changed) {
    const patchFile = path.join(PATCH_ROOT, path.basename(filePath));
    fs.writeFileSync(patchFile, patched, "utf8");
    console.log(`📄 Patch written: ${patchFile}`);
  }
});

console.log("\n=== CORELAB CSS AUTO-FIXER COMPLETE ===");
console.log("Review patched files in /src/diagnostics/css-patches/");
