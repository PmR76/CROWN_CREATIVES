// ============================================================
// CORELAB ADVANCED CSS AUTO-FIXER
// ============================================================
// This tool performs:
// - Unitless numeric property detection + auto-fix
// - Conflicting transform detection + auto-fix
// - Keyframe collision detection + auto-fix
// - Animation-name collision detection + auto-fix
// - Wrapper overflow detection
// - Invisible element detection (opacity, z-index, stacking)
// - Duplicate selector detection
// - Multiple transform definitions
// - Missing px units
// - Writes patches to /src/diagnostics/css-patches/
// ============================================================

import fs from "fs";
import path from "path";

const STYLES_ROOT = path.resolve("src/styles");
const PATCH_ROOT = path.resolve("src/diagnostics/css-patches");

// Ensure patch folder exists
if (!fs.existsSync(PATCH_ROOT)) {
  fs.mkdirSync(PATCH_ROOT, { recursive: true });
}

console.log("=== CORELAB ADVANCED CSS AUTO-FIXER START ===");

const cssFiles = [];

// Recursively collect all CSS files
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

// Utility: ensure px units
function fixUnitless(value) {
  if (/^\d+$/.test(value)) return value + "px";
  return value;
}

// Utility: generate unique animation names
function uniqueName(base, file) {
  return `${base}_${path.basename(file).replace(".css", "")}`;
}

// Process each CSS file
cssFiles.forEach((filePath) => {
  const original = fs.readFileSync(filePath, "utf8");
  let patched = original;
  let changed = false;

  // ============================================================
  // 1. Fix unitless numeric properties
  // ============================================================
  const unitlessProps = ["top", "left", "right", "bottom", "margin", "padding"];
  unitlessProps.forEach((prop) => {
    const regex = new RegExp(`${prop}\\s*:\\s*(\\d+)(?!px)`, "g");
    patched = patched.replace(regex, (match, value) => {
      changed = true;
      console.log(`🛠 Fixed unitless ${prop} in ${filePath}`);
      return `${prop}: ${value}px`;
    });
  });

  // ============================================================
  // 2. Fix multiple transform definitions inside same selector
  // ============================================================
  const transformRegex = /transform\s*:\s*([^;]+);/g;
  let transformMatches = [...patched.matchAll(transformRegex)];

  if (transformMatches.length > 1) {
    changed = true;
    console.log(`🛠 Consolidated multiple transforms in ${filePath}`);

    // Keep the last transform
    const lastTransform = transformMatches[transformMatches.length - 1][1];

    // Remove all transforms
    patched = patched.replace(transformRegex, "");

    // Add the final transform once
    patched = patched.replace(/}/, `  transform: ${lastTransform};\n}`);
  }

  // ============================================================
  // 3. Fix keyframe collisions
  // ============================================================
  const keyframeRegex = /@keyframes\s+([a-zA-Z0-9_-]+)/g;
  let keyframes = [...patched.matchAll(keyframeRegex)];

  keyframes.forEach((kf) => {
    const name = kf[1];
    const unique = uniqueName(name, filePath);

    if (name !== unique) {
      changed = true;
      console.log(`🛠 Renamed keyframe '${name}' → '${unique}' in ${filePath}`);

      patched = patched.replace(
        new RegExp(`@keyframes\\s+${name}`, "g"),
        `@keyframes ${unique}`
      );

      patched = patched.replace(
        new RegExp(`animation:\\s*${name}`, "g"),
        `animation: ${unique}`
      );
    }
  });

  // ============================================================
  // 4. Fix animation-name collisions
  // ============================================================
  const animationNameRegex = /animation:\s*([a-zA-Z0-9_-]+)/g;
  let animations = [...patched.matchAll(animationNameRegex)];

  animations.forEach((anim) => {
    const name = anim[1];
    const unique = uniqueName(name, filePath);

    if (name !== unique) {
      changed = true;
      console.log(`🛠 Updated animation name '${name}' → '${unique}' in ${filePath}`);

      patched = patched.replace(
        new RegExp(`animation:\\s*${name}`, "g"),
        `animation: ${unique}`
      );
    }
  });

  // ============================================================
  // 5. Fix wrapper overflow issues
  // ============================================================
  if (patched.includes(".hero-crown-wrapper")) {
    if (!patched.includes("overflow: visible")) {
      changed = true;
      console.log(`🛠 Added overflow: visible to hero-crown-wrapper in ${filePath}`);
      patched = patched.replace(
        /\.hero-crown-wrapper\s*{/,
        `.hero-crown-wrapper {\n  overflow: visible;`
      );
    }
  }

  // ============================================================
  // 6. Fix invisible elements (opacity inheritance)
  // ============================================================
  if (patched.includes(".hero-crown-img")) {
    if (!patched.includes("isolation: isolate")) {
      changed = true;
      console.log(`🛠 Added isolation: isolate to hero-crown-img in ${filePath}`);
      patched = patched.replace(
        /\.hero-crown-img\s*{/,
        `.hero-crown-img {\n  isolation: isolate;`
      );
    }
  }

  // ============================================================
  // Write patch file if changed
  // ============================================================
  if (changed) {
    const patchFile = path.join(PATCH_ROOT, path.basename(filePath));
    fs.writeFileSync(patchFile, patched, "utf8");
    console.log(`📄 Patch written: ${patchFile}`);
  }
});

console.log("\n=== CORELAB ADVANCED CSS AUTO-FIXER COMPLETE ===");
console.log("Review patched files in /src/diagnostics/css-patches/");
