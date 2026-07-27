// ============================================================
// CoreLab CSS Conflict Scanner
// - Finds duplicate selectors across files
// - Flags conflicting property values
// - Flags unitless numeric properties
// - Flags multiple transform definitions
// ============================================================

import fs from "fs";
import path from "path";

const STYLES_ROOT = path.resolve("src/styles");

const cssFiles = [];
const selectorMap = {}; // selector -> [{ file, props }]
const issues = [];

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

// Very simple CSS parser (selector { ... } blocks)
function parseCSS(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const blocks = content.split("}");

  blocks.forEach((block) => {
    const parts = block.split("{");
    if (parts.length !== 2) return;

    const selector = parts[0].trim();
    const body = parts[1].trim();

    if (!selector) return;

    const props = {};
    body.split(";").forEach((line) => {
      const [rawKey, rawVal] = line.split(":");
      if (!rawKey || !rawVal) return;
      const key = rawKey.trim();
      const val = rawVal.trim();
      if (!key || !val) return;
      props[key] = val;
    });

    if (!selectorMap[selector]) selectorMap[selector] = [];
    selectorMap[selector].push({ file: filePath, props });
  });
}

// Parse all CSS files
cssFiles.forEach(parseCSS);

// Analyse selectors for conflicts
Object.entries(selectorMap).forEach(([selector, entries]) => {
  if (entries.length <= 1) return;

  // Check for conflicting properties
  const propValues = {}; // key -> Set of values

  entries.forEach(({ file, props }) => {
    Object.entries(props).forEach(([key, val]) => {
      if (!propValues[key]) propValues[key] = new Set();
      propValues[key].add(val);

      // Unitless numeric properties (likely bugs)
      if (
        ["top", "left", "right", "bottom", "margin", "padding"].includes(key) &&
        /^\d+$/.test(val)
      ) {
        issues.push({
          type: "Unitless numeric property",
          selector,
          property: key,
          value: val,
          file,
        });
      }

      // Multiple transform definitions
      if (key === "transform") {
        issues.push({
          type: "Transform definition",
          selector,
          value: val,
          file,
        });
      }
    });
  });

  // If any property has more than one value across files, flag it
  Object.entries(propValues).forEach(([key, values]) => {
    if (values.size > 1) {
      issues.push({
        type: "Conflicting property",
        selector,
        property: key,
        values: Array.from(values),
        files: entries.map((e) => e.file),
      });
    }
  });
});

// Output report
console.log("=== CORELAB CSS CONFLICT REPORT ===");

if (issues.length === 0) {
  console.log("No conflicts detected.");
} else {
  issues.forEach((issue) => {
    console.log("\n⚠️ Issue:", issue.type);
    console.log("Selector:", issue.selector);
    if (issue.property) console.log("Property:", issue.property);
    if (issue.value) console.log("Value:", issue.value);
    if (issue.values) console.log("Values:", issue.values.join(" | "));
    if (issue.file) console.log("File:", issue.file);
    if (issue.files) {
      console.log("Files:");
      issue.files.forEach((f) => console.log(" - " + f));
    }
  });
}

console.log("\n=== END OF CSS CONFLICT REPORT ===");
