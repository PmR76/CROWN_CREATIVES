import fs from "fs";
import path from "path";

const config = JSON.parse(fs.readFileSync("sentinel/sentinel-config.json", "utf8"));
const registryPath = "sentinel/sentinel-registry.json";
const treePath = "sentinel/sentinel-tree.txt";

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

function runSentinel() {
  console.log("=== SENTINEL SNAPSHOT ===");

  const tree = buildTree();
  fs.writeFileSync(registryPath, JSON.stringify(tree, null, 2));

  console.log("Snapshot complete.");
  console.log("File tree saved to sentinel-tree.txt");
}

runSentinel();
