// ============================================================
// CoreLab Ghost & Duplicate Detector
// ============================================================

import fs from "fs";
import path from "path";

const ROOT = path.resolve("src");

const files = [];
const components = {};
const defaultExports = {};
const issues = [];

// Recursively scan src/
function scan(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      scan(full);
    } else if (entry.name.endsWith(".jsx") || entry.name.endsWith(".js")) {
      files.push(full);
    }
  }
}

scan(ROOT);

// Analyse each file
files.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");

  // Detect default export name
  const defaultMatch =
    content.match(/export default function (\w+)/) ||
    content.match(/export default (\w+)/);

  if (defaultMatch) {
    const name = defaultMatch[1];

    if (!defaultExports[name]) defaultExports[name] = [];
    defaultExports[name].push(file);
  }

  // Detect component names
  const componentMatches = content.match(/function (\w+)/g);
  if (componentMatches) {
    componentMatches.forEach((m) => {
      const name = m.replace("function ", "");
      if (!components[name]) components[name] = [];
      components[name].push(file);
    });
  }
});

// Report duplicate default exports
Object.entries(defaultExports).forEach(([name, files]) => {
  if (files.length > 1) {
    issues.push({
      type: "Duplicate Default Export",
      name,
      files,
    });
  }
});

// Report duplicate component names
Object.entries(components).forEach(([name, files]) => {
  if (files.length > 1) {
    issues.push({
      type: "Duplicate Component Name",
      name,
      files,
    });
  }
});

// Report ghost files (exist but never imported)
files.forEach((file) => {
  const rel = file.replace(ROOT + "\\", "").replace(ROOT + "/", "");
  const imported = Object.values(defaultExports)
    .flat()
    .concat(Object.values(components).flat());

  if (!imported.includes(file)) {
    issues.push({
      type: "Ghost File",
      file,
    });
  }
});

// Output results
console.log("=== CORELAB GHOST & DUPLICATE REPORT ===");

if (issues.length === 0) {
  console.log("No issues found.");
} else {
  issues.forEach((issue) => {
    console.log("\n⚠️ Issue:", issue.type);
    if (issue.name) console.log("Name:", issue.name);
    if (issue.files) {
      console.log("Files:");
      issue.files.forEach((f) => console.log(" - " + f));
    }
    if (issue.file) console.log("File:", issue.file);
  });
}

console.log("\n=== END OF REPORT ===");
