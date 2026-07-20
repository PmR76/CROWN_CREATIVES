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

  if (!repaired.ui) repaired.ui = {};
  if (!Array.isArray(repaired.ui.coreReact)) repaired.ui.coreReact = ["test/core-lab-react/src"];
  if (!Array.isArray(repaired.ui.labs)) repaired.ui.labs = [];
  if (!Array.isArray(repaired.ui.legacy)) repaired.ui.legacy = [];
  if (!Array.isArray(repaired.ui.cssNames)) repaired.ui.cssNames = [];

  if (!Array.isArray(repaired.scan)) repaired.scan = ["test/core-lab-react/src", "test/core-lab-react/public"];
  if (!Array.isArray(repaired.ignore)) repaired.ignore = ["node_modules", ".git", "dist"];
  if (!Array.isArray(repaired.required)) repaired.required = ["test/core-lab-react/src", "test/core-lab-react/public"];

  if (!repaired.devUrl) repaired.devUrl = "http://localhost:5176";
  if (!repaired.prodUrl) repaired.prodUrl = "https://example.com";
  if (!repaired.timeoutMs) repaired.timeoutMs = 2000;

  return repaired;
}

const safeConfig = ensureConfigShape(config);

// Write repaired config
try {
  fs.writeFileSync(
    path.join(__dirname, "sentinel-config.repaired.json"),
    JSON.stringify(safeConfig, null, 2),
    "utf8"
  );
} catch {}

// ------------------------------------------------------------
// 3. Paths
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
// COLLECT FILES
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

// ------------------------------------------------------------
// ENFORCE UNIQUENESS — delete duplicate files
// ------------------------------------------------------------
function enforceUniqueness(duplicates) {
  const deletions = [];

  for (const d of duplicates) {
    const { name, locations } = d;

    const canonical = locations[0];

    for (const loc of locations.slice(1)) {
      const fullPath = path.join(PROJECT_ROOT, loc, name);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        deletions.push({ name, deletedFrom: loc });
      }
    }
  }

  fs.writeFileSync(
    path.join(__dirname, "sentinel-cleanup.json"),
    JSON.stringify(deletions, null, 2)
  );

  return deletions;
}

// ------------------------------------------------------------
// HEALTH CHECK
// ------------------------------------------------------------
function computeHealth(tree) {
  const { files } = collectFiles(tree);

  const seen = new Map();
  const duplicates = [];
  const missing = [];

  for (const required of safeConfig.required) {
    const full = path.join(PROJECT_ROOT, required);
    if (!fs.existsSync(full)) missing.push(required);
  }

  for (const file of files) {
    const key = file.name;
    if (!seen.has(key)) seen.set(key, []);
    seen.get(key).push(file.folder);
  }

  for (const [name, locations] of seen.entries()) {
    if (locations.length > 1) duplicates.push({ name, locations });
  }

  fs.writeFileSync(duplicatesPath, JSON.stringify(duplicates, null, 2));

  const status =
    missing.length > 0 ? "red" :
    duplicates.length > 0 ? "amber" :
    "green";

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
// UI CONFLICT DETECTION
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
        inGroup(folder, coreReactRoots) ? "core" :
        inGroup(folder, labRoots) ? "lab" :
        inGroup(folder, legacyRoots) ? "legacy" :
        "other";

      cssConflicts.push({ name, folder, group });
    }
  }

  for (const d of duplicates) {
    for (const loc of d.locations) {
      const group =
        inGroup(loc, coreReactRoots) ? "core" :
        inGroup(loc, labRoots) ? "lab" :
        inGroup(loc, legacyRoots) ? "legacy" :
        "other";

      if (!uiConfig.cssNames.includes(d.name)) {
        componentConflicts.push({ name: d.name, folder: loc, group });
      }
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

  if (duplicates.length > 0) {
    console.log("Duplicates detected — enforcing uniqueness...");
    const deletions = enforceUniqueness(duplicates);
    console.log("Deleted duplicates:", deletions);

    const tree2 = buildTree();
    const { health: health2 } = computeHealth(tree2);

    console.log("Post-cleanup Sentinel status:", health2.status);
  }

  const uiConflicts = detectUIConflicts(tree, duplicates);

  console.log("Snapshot complete.");
  console.log("Sentinel status:", health.status);
}

runSentinel();
