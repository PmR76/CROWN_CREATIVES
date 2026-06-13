/* ============================================================
   CROWN CREATIVES — MASTER JS
   Loads the master template, injects global components,
   wires theme + sound + back-to-top engines,
   and loads page-specific engines.
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

  // 3.1 Load master wrapper
  container.innerHTML = await loadPartial("/master/page-wrapper.html");

  // 3.2 Inject global components (DOM must exist before engines)
  document.getElementById("cc-background").innerHTML =
    await loadPartial("/master/background.html");

  document.getElementById("cc-header").innerHTML =
    await loadPartial("/master/header.html");

  document.getElementById("cc-ticker").innerHTML =
    await loadPartial("/master/ticker.html");

  document.getElementById("cc-footer").innerHTML =
    await loadPartial("/master/footer.html");

  // 3.3 Load global JS engines AFTER header/footer exist
  await loadScript("/assets/js/theme.js");
  await loadScript("/assets/js/sound-engine.js");
  await loadScript("/assets/js/backtotop.js");

  // 3.3a Initialise THEME ENGINE
  if (typeof window.initThemeEngine === "function") {
    window.initThemeEngine();
  }

  // 3.3b Initialise SOUND ENGINE
  if (typeof window.initSoundEngine === "function") {
    window.initSoundEngine();
  }

  // 3.3c Initialise BACK TO TOP ENGINE
  if (typeof window.initBackToTop === "function") {
    window.initBackToTop();
  }

  // 3.4 Load page-specific engine (optional)
  const enginePath = `/assets/js/${page}.js`;

  fetch(enginePath)
    .then(res => {
      if (res.ok) return loadScript(enginePath);
      console.warn(`No page engine found for: ${page}`);
    })
    .catch(() => console.warn(`Engine load failed for: ${page}`));
}

/* ------------------------------------------------------------
   4. START MASTER SYSTEM
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", initMaster);
