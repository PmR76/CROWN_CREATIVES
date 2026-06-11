/* ============================================================
   CROWN CREATIVES — MASTER JS
   Loads the master template, injects global components,
   wires theme + sound engines, and loads page-specific engines.
============================================================ */

/* ------------------------------------------------------------
   1. UTILITY — LOAD HTML PARTIALS
------------------------------------------------------------ */
async function loadPartial(path) {
  const res = await fetch(path + "?v=" + Date.now());
  return await res.text();
}

/* ------------------------------------------------------------
   2. UTILITY — LOAD JS FILES DYNAMICALLY
------------------------------------------------------------ */
function loadScript(path) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = path + "?v=" + Date.now();
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

/* ------------------------------------------------------------
   3. MASTER INITIALISATION
------------------------------------------------------------ */
async function initMaster() {
  const container = document.getElementById("master-container");
  if (!container) return console.error("Master container missing.");

  const page = container.dataset.page || "home";

  /* Load master wrapper */
  container.innerHTML = await loadPartial("/master/page-wrapper.html");

  /* Inject global components */
  document.getElementById("cc-background").innerHTML =
    await loadPartial("/master/background.html");

  document.getElementById("cc-header").innerHTML =
    await loadPartial("/master/header.html");

  document.getElementById("cc-ticker").innerHTML =
    await loadPartial("/master/ticker.html");

  document.getElementById("cc-footer").innerHTML =
    await loadPartial("/master/footer.html");

  /* ------------------------------------------------------------
     4. LOAD GLOBAL JS ENGINES
  ------------------------------------------------------------ */
  await loadScript("/assets/js/theme.js");
  await loadScript("/assets/js/sound-engine.js");

  /* ------------------------------------------------------------
     5. LOAD PAGE-SPECIFIC ENGINE
  ------------------------------------------------------------ */
  const enginePath = `/assets/js/${page}.js`;

  fetch(enginePath)
    .then(res => {
      if (res.ok) return loadScript(enginePath);
      console.warn(`No page engine found for: ${page}`);
    })
    .catch(() => console.warn(`Engine load failed for: ${page}`));
}

/* ------------------------------------------------------------
   6. START MASTER SYSTEM
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", initMaster);
