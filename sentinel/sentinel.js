import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, "..");

// ------------------------------------------------------------
// 1. Load config FIRST
// ------------------------------------------------------------
const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, "sentinel-config.json"), "utf8")
);

// ------------------------------------------------------------
// 2. SAFE MODE — now config exists, so we can repair it
// ------------------------------------------------------------
function ensureConfigShape(cfg) {
  const repaired = { ...cfg };

  if (!repaired.ui) {
    console.warn("[Sentinel Safe Mode] Missing 'ui' block — creating default.");
    repaired.ui = {};
  }

  if (!Array.isArray(repaired.ui.coreReact)) {
    console.warn("[Sentinel Safe Mode] Missing 'ui.coreReact' — inserting defaults.");
    repaired.ui.coreReact = [
      "src",
      "core-lab-react/src",
      "components"
    ];
  }

  if (!Array.isArray(repaired.ui.labs)) {
    console.warn("[Sentinel Safe Mode] Missing 'ui.labs' — inserting defaults.");
    repaired.ui.labs = [];
  }

  if (!Array.isArray(repaired.ui.legacy)) {
    console.warn("[Sentinel Safe Mode] Missing 'ui.legacy' — inserting defaults.");
    repaired.ui.legacy = [];
  }

  if (!Array.isArray(repaired.ui.cssNames)) {
    console.warn("[Sentinel Safe Mode] Missing 'ui.cssNames' — inserting defaults.");
    repaired.ui.cssNames = [];
  }

  if (!Array.isArray(repaired.scan)) {
    console.warn("[Sentinel Safe Mode] Missing 'scan' — inserting defaults.");
    repaired.scan = ["src", "public"];
  }

  if (!Array.isArray(repaired.ignore)) {
    console.warn("[Sentinel Safe Mode] Missing 'ignore' — inserting defaults.");
    repaired.ignore = ["node_modules", ".git", "dist"];
  }

  if (!Array.isArray(repaired.required)) {
    console.warn("[Sentinel Safe Mode] Missing 'required' — inserting defaults.");
    repaired.required = ["src", "public"];
  }

  if (!repaired.devUrl) {
    console.warn("[Sentinel Safe Mode] Missing 'devUrl' — inserting placeholder.");
    repaired.devUrl = "http://localhost:5176";
  }

  if (!repaired.prodUrl) {
    console.warn("[Sentinel Safe Mode] Missing 'prodUrl' — inserting placeholder.");
    repaired.prodUrl = "https://example.com";
  }

  if (!repaired.timeoutMs) {
    console.warn("[Sentinel Safe Mode] Missing 'timeoutMs' — inserting default.");
    repaired.timeoutMs = 2000;
  }

  return repaired;
}

const safeConfig = ensureConfigShape(config);

// Optional: write repaired config
try {
  fs.writeFileSync(
    path.join(__dirname, "sentinel-config.repaired.json"),
    JSON.stringify(safeConfig, null, 2),
    "utf8"
  );
  console.warn("[Sentinel Safe Mode] Repaired config written to sentinel-config.repaired.json");
} catch (err) {
  console.warn("[Sentinel Safe Mode] Could not write repaired config:", err);
}

// ------------------------------------------------------------
// 3. Now use safeConfig everywhere
// ------------------------------------------------------------
const registryPath = path.join(__dirname, "sentinel-registry.json");
const treePath = path.join(__dirname, "sentinel-tree.txt");
const healthPath = path.join(__dirname, "sentinel-health.json");
const duplicatesPath = path.join(__dirname, "sentinel-duplicates.json");
const uiConflictsPath = path.join(__dirname, "sentinel-ui-conflicts.json");

// ------------------------------------------------------------
// SCAN FOLDERS
// ------------------------------------------------------------
function scanFolder(folder) {
  const full = path.join(PROJECT_ROOT, folder);

  if (!fs.existsSync(full)) {
    return { folder, items: [`❌ Missing folder: ${folder}`] };
  }

  const items = fs.readdirSync(full);
  const branch = { folder, items: [] };

  for (const item of items) {
    const itemPath = path.join(full, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      if (!safeConfig.ignore.includes(item)) {
        branch.items.push(scanFolder(path.join(folder, item)));
      }
    } else {
      branch.items.push(item);
    }
  }

  return branch;
}

// ------------------------------------------------------------
// BUILD TREE
// ------------------------------------------------------------
function buildTree() {
  const tree = [];

  for (const folder of safeConfig.scan) {
    tree.push(scanFolder(folder));
  }

  fs.writeFileSync(treePath, formatTree(tree));
  return tree;
}

// ------------------------------------------------------------
// FORMAT TREE
// ------------------------------------------------------------
function formatTree(tree, indent = 0) {
  let out = "";
  const pad = "   ".repeat(indent);

  for (const node of tree) {
    out += `${pad}📁 ${node.folder}\n`;
    for (const item of node.items) {
      if (typeof item === "string") {
        out += `${pad}   🟢 ${item}\n`;
      } else {
        out += formatTree([item], indent + 1);
      }
    }
  }

  return out;
}

// ------------------------------------------------------------
// DUPLICATES + MISSING
// ------------------------------------------------------------
function collectFiles(tree) {
  const files = [];
  const folders = [];

  function walk(node) {
    folders.push(node.folder);
    for (const item of node.items) {
      if (typeof item === "string") {
        files.push({ folder: node.folder, name: item });
      } else {
        walk(item);
      }
    }
  }

  for (const root of tree) walk(root);
  return { files, folders };
}

function computeHealth(tree) {
  const { files } = collectFiles(tree);

  const seen = new Map();
  const duplicates = [];
  const missing = [];

  for (const required of safeConfig.required) {
    const full = path.join(PROJECT_ROOT, required);
    if (!fs.existsSync(full)) {
      missing.push(required);
    }
  }

  for (const file of files) {
    const key = file.name;
    if (!seen.has(key)) {
      seen.set(key, []);
    }
    seen.get(key).push(file.folder);
  }

  for (const [name, locations] of seen.entries()) {
    if (locations.length > 1) {
      duplicates.push({ name, locations });
    }
  }

  fs.writeFileSync(duplicatesPath, JSON.stringify(duplicates, null, 2));

  const status =
    missing.length > 0
      ? "red"
      : duplicates.length > 0
      ? "amber"
      : "green";

  const health = {
    timestamp: new Date().toISOString(),
    missing,
    duplicates: duplicates.map(d => d.name),
    status
  };

  fs.writeFileSync(healthPath, JSON.stringify(health, null, 2));
  return { health, duplicates };
}

// ------------------------------------------------------------
// UI CONFLICT DETECTION (v1.2)
// ------------------------------------------------------------
function detectUIConflicts(tree, duplicates) {
  const { files } = collectFiles(tree);

  const uiConfig = safeConfig.ui;
  const coreReactRoots = uiConfig.coreReact;
  const labRoots = uiConfig.labs;
  const legacyRoots = uiConfig.legacy;

  function inGroup(folder, roots) {
    return roots.some(root => folder.startsWith(root));
  }

  const cssConflicts = [];
  const componentConflicts = [];
  const legacyActive = [];
  const labActive = [];
  const coreActive = [];

  for (const file of files) {
    const { folder, name } = file;

    if (uiConfig.cssNames.includes(name)) {
      const group =
        inGroup(folder, coreReactRoots)
          ? "core"
          : inGroup(folder, labRoots)
          ? "lab"
          : inGroup(folder, legacyRoots)
          ? "legacy"
          : "other";

      cssConflicts.push({ name, folder, group });
    }
  }

  for (const d of duplicates) {
    for (const loc of d.locations) {
      const group =
        inGroup(loc, coreReactRoots)
          ? "core"
          : inGroup(loc, labRoots)
          ? "lab"
          : inGroup(loc, legacyRoots)
          ? "legacy"
          : "other";

      if (uiConfig.cssNames.includes(d.name)) {
        continue;
      }

      componentConflicts.push({
        name: d.name,
        folder: loc,
        group
      });
    }
  }

  for (const file of files) {
    const { folder } = file;
    if (inGroup(folder, legacyRoots)) legacyActive.push(folder);
    if (inGroup(folder, labRoots)) labActive.push(folder);
    if (inGroup(folder, coreReactRoots)) coreActive.push(folder);
  }

  const uiConflicts = {
    legacyActive: [...new Set(legacyActive)],
    labActive: [...new Set(labActive)],
    coreActive: [...new Set(coreActive)],
    cssConflicts,
    componentConflicts
  };

  fs.writeFileSync(uiConflictsPath, JSON.stringify(uiConflicts, null, 2));
  return uiConflicts;
}

// ------------------------------------------------------------
// RUN SENTINEL v1.2
// ------------------------------------------------------------
function runSentinel() {
  console.log("=== SENTINEL v1.2 SNAPSHOT ===");

  const tree = buildTree();
  fs.writeFileSync(registryPath, JSON.stringify(tree, null, 2));

  const { health, duplicates } = computeHealth(tree);
  const uiConflicts = detectUIConflicts(tree, duplicates);

  console.log("Snapshot complete.");
  console.log("File tree saved to sentinel-tree.txt");
  console.log("Registry saved to sentinel-registry.json");
  console.log("Health report saved to sentinel-health.json");
  console.log("Duplicates saved to sentinel-duplicates.json");
  console.log("UI conflicts saved to sentinel-ui-conflicts.json");
  console.log("Sentinel status:", health.status);

  if (uiConflicts.legacyActive.length > 0) {
    console.log("Legacy UI still active in:", uiConflicts.legacyActive);
  }
  if (uiConflicts.labActive.length > 0) {
    console.log("Labs active in:", uiConflicts.labActive);
  }
}

runSentinel();
