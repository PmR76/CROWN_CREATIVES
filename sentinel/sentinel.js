import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ------------------------------------------------------------
// ES MODULE SAFE __dirname
// ------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------------------------------------------
// PROJECT ROOT (one folder above /sentinel)
// ------------------------------------------------------------
const PROJECT_ROOT = path.join(__dirname, "..");

// ------------------------------------------------------------
// PATHS (bulletproof)
// ------------------------------------------------------------
const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, "sentinel-config.json"), "utf8")
);

const registryPath = path.join(__dirname, "sentinel-registry.json");
const treePath = path.join(__dirname, "sentinel-tree.txt");
const healthPath = path.join(__dirname, "sentinel-health.json");

// ------------------------------------------------------------
// SCAN FOLDERS
// ------------------------------------------------------------
function scanFolder(folder, tree = []) {
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
      if (!config.ignore.includes(item)) {
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

  for (const folder of config.scan) {
    tree.push(scanFolder(folder));
  }

  fs.writeFileSync(treePath, formatTree(tree));
  return tree;
}

// ------------------------------------------------------------
// FORMAT TREE (pretty output)
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
// HEALTH CHECK
// ------------------------------------------------------------
function computeHealth(tree) {
  let missing = [];
  let duplicates = [];
  let seen = new Set();

  function walk(node) {
    for (const item of node.items) {
      if (typeof item === "string") {
        if (item.startsWith("❌ Missing folder")) {
          missing.push(item);
        }
        if (seen.has(item)) duplicates.push(item);
        seen.add(item);
      } else {
        walk(item);
      }
    }
  }

  for (const root of tree) walk(root);

  const health = {
    timestamp: new Date().toISOString(),
    missing,
    duplicates,
    status:
      missing.length > 0
        ? "red"
        : duplicates.length > 0
        ? "amber"
        : "green"
  };

  fs.writeFileSync(healthPath, JSON.stringify(health, null, 2));
  return health;
}

// ------------------------------------------------------------
// RUN SENTINEL
// ------------------------------------------------------------
function runSentinel() {
  console.log("=== SENTINEL SNAPSHOT ===");

  const tree = buildTree();
  fs.writeFileSync(registryPath, JSON.stringify(tree, null, 2));

  const health = computeHealth(tree);

  console.log("Snapshot complete.");
  console.log("File tree saved to sentinel-tree.txt");
  console.log("Health report saved to sentinel-health.json");
  console.log("Sentinel status:", health.status);
}

runSentinel();
