document.getElementById("scanFilesBtn").addEventListener("click", () => {
  scanFileTree(".");
});

async function scanFileTree(startPath) {
  const output = document.getElementById("fileTreeOutput");
  output.textContent = "[ SCANNING... ]\n";

  try {
    const tree = await buildTree(startPath);
    output.textContent = formatTree(tree);
  } catch (err) {
    output.textContent = "[ ERROR: UNABLE TO SCAN DIRECTORY ]\n" + err;
  }
}

async function buildTree(path) {
  const res = await fetch(path);
  const text = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");

  const links = [...doc.querySelectorAll("a")];

  const children = [];

  for (const link of links) {
    const name = link.textContent;
    if (name === "../") continue;

    const fullPath = path + "/" + name;

    if (name.endsWith("/")) {
      children.push({
        type: "folder",
        name: name.replace("/", ""),
        children: await buildTree(fullPath.replace("//", "/"))
      });
    } else {
      children.push({
        type: "file",
        name
      });
    }
  }

  return children;
}

function formatTree(tree, indent = "") {
  let out = "";

  for (const item of tree) {
    if (item.type === "folder") {
      out += `${indent}📁 ${item.name}/\n`;
      out += formatTree(item.children, indent + "   ");
    } else {
      out += `${indent}📄 ${item.name}\n`;
    }
  }

  return out;
}
