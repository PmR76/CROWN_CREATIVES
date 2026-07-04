import fs from "fs";
import path from "path";

const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, "sentinel-config.json"), "utf8")
);

const registryPath = path.join(__dirname, "sentinel-registry.json");
const treePath = path.join(__dirname, "sentinel-tree.txt");
const healthPath = path.join(__dirname, "sentinel-health.json");

function scanFolder(folder, tree = [], base = "") {
  const full = path.join(base, folder);
  const items = fs.readdirSync(full);

  const branch = { folder, items: [] };

  for (const item of items) {
    const itemPath = path.join(full, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      if (!config.ignore.includes(item)) {
        branch.items.push(scanFolder(item, [], full));
      }
    } else {
      branch.items.push(item);
    }
  }

  return branch;
}

function buildTree() {
  const tree = [];

  for (const folder of config.scan) {
    tree.push(scanFolder(folder));
  }

  fs.writeFileSync(treePath, formatTree(tree));
  return tree;
}

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

function computeHealth(tree) {
  let missing = [];
  let duplicates = [];
  let seen = new Set();

  function walk(node) {
    for (const item of node.items) {
      if (typeof item === "string") {
        if (seen.has(item)) duplicates.push(item);
        seen.add(item);
      } else {
        walk(item);
      }
    }
  }

  for (const root of tree) walk(root);

  for (const required of config.required) {
    if (!fs.existsSync(required)) {
      missing.push(required);
    }
  }

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
