/* ============================================================
   CROWN CREATIVES — MASTER JS (GR1 VERSION, HARDENED)
   Loads the master template, injects global components,
   wires theme + sound + back-to-top engines,
   and loads page-specific engines.
============================================================ */

/* ------------------------------------------------------------
   1. UTILITY — LOAD HTML PARTIALS
------------------------------------------------------------ */
async function loadPartial(path) {
  const res = await fetch(path + "?v=" + Date.now());
  if (!res.ok) {
    console.warn("Partial not found:", path);
    return "";
  }
  return await res.text();
}

/* ------------------------------------------------------------
   2. UTILITY — LOAD JS FILES DYNAMICALLY
------------------------------------------------------------ */
function loadScript(path) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = path + "?v=" + Date.now();
    s.onload = () => resolve();
    s.onerror = () => {
      console.warn("Script load failed:", path);
      reject();
    };
    document.body.appendChild(s);
  });
}

/* ------------------------------------------------------------
   3. MASTER INITIALISATION
------------------------------------------------------------ */
async function initMaster() {
  const container = document.getElementById("master-container");

  // If there is no master container, do nothing (safe for pages without master)
  if (!container) {
    console.info("Master container missing — master.js idle on this page.");
    return;
  }

  const page = container.dataset.page || "home";

  /* ------------------------------
     3.1 Load master wrapper
  ------------------------------ */
  container.innerHTML = await loadPartial("/master/page-wrapper.html");

  /* ------------------------------
     3.2 Inject global components
  ------------------------------ */
  const bgEl        = document.getElementById("cc-background");
  const headerEl    = document.getElementById("cc-header");
  const contentEl   = document.getElementById("cc-page-content");
  const tickerEl    = document.getElementById("cc-ticker");
  const footerWrapEl = document.getElementById("cc-footer-wrapper");

  if (bgEl) {
    bgEl.innerHTML = await loadPartial("/master/background.html");
  }

  if (headerEl) {
    headerEl.innerHTML = await loadPartial("/master/header.html");
  }

  if (contentEl) {
    contentEl.innerHTML = await loadPartial(`/pages/${page}.html`);
  }

  /* ------------------------------------------------------------
     3.2a TICKER INJECTION — DISABLED IN /test/
  ------------------------------------------------------------ */
  if (!location.pathname.includes("/test/")) {
    if (tickerEl) {
      tickerEl.innerHTML = await loadPartial("/master/ticker.html");
    }
  } else {
    console.info("Ticker injection skipped in /test/ environment.");
  }

  /* ------------------------------------------------------------
     3.2b FOOTER INJECTION — DISABLED IN /test/
  ------------------------------------------------------------ */
  if (!location.pathname.includes("/test/")) {
    if (footerWrapEl) {
      footerWrapEl.innerHTML = await loadPartial("/master/footer.html");
    }
  } else {
    console.info("Footer injection skipped in /test/ environment.");
  }

  /* ------------------------------
     3.3 Load global JS engines
  ------------------------------ */
  await loadScript("/assets/js/theme.js").catch(() => {});
  await loadScript("/assets/js/sound-engine.js").catch(() => {});
  await loadScript("/assets/js/backtotop.js").catch(() => {});

  /* ------------------------------
     3.3a Initialise THEME ENGINE
  ------------------------------ */
  function waitForToggleAndInitTheme() {
    const toggle = document.getElementById("themeToggle");
    if (toggle && typeof window.initThemeEngine === "function") {
      window.initThemeEngine();
    } else if (!toggle) {
      requestAnimationFrame(waitForToggleAndInitTheme);
    }
  }
  waitForToggleAndInitTheme();

  /* ------------------------------
     3.3b Initialise SOUND ENGINE
  ------------------------------ */
  if (typeof window.initSoundEngine === "function") {
    window.initSoundEngine();
  }

  /* ------------------------------
     3.3c Initialise BACK TO TOP ENGINE
  ------------------------------ */
  setTimeout(() => {
    if (typeof window.initBackToTop === "function") {
      window.initBackToTop();
    }
  }, 150);

  /* ------------------------------
     3.3d Initialise MODULES
  ------------------------------ */
  if (typeof window.initHeroCrown === "function") {
    window.initHeroCrown();
  }
  if (typeof window.initThemePanel === "function") {
    window.initThemePanel();
  }

  /* ------------------------------
     3.4 Load page-specific engine
  ------------------------------ */
  const enginePath = `/assets/js/${page}.js`;

  fetch(enginePath)
    .then(res => {
      if (res.ok) {
        return loadScript(enginePath);
      }
      console.warn(`No page engine found for: ${page}`);
    })
    .then(() => {
      /* ------------------------------
         3.5 Initialise HERO GALLERY
      ------------------------------ */
      if (typeof window.initHeroGallery === "function") {
        window.initHeroGallery();
      }
    })
    .catch(() => console.warn(`Engine load failed for: ${page}`));
}

/* ------------------------------------------------------------
   4. START MASTER SYSTEM
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", initMaster);
/* ------------------------------
   Inject Theme Panel (TEST ONLY)
------------------------------ */
if (location.pathname.includes("/test/")) {
  const panelWrap = document.createElement("div");
  panelWrap.innerHTML = await loadPartial("/test/theme-panel/theme-panel.html");
  document.body.appendChild(panelWrap);
  await loadScript("/test/theme-panel/theme-panel.js");
}
