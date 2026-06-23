/* ============================================================
   CROWN CREATIVES — BACKGROUND THEME PANEL (MODULE VERSION)
   SHIFT+T to open • X to close • Draggable • Day/Night modes
============================================================ */

(function () {

  const PANEL_POS_KEY = "themePanelPos";
  const BG_KEY = "cc-background-mode";

  let panel = null;
  let dragging = false;
  let startX = 0, startY = 0;
  let startLeft = 0, startTop = 0;

  if (window.__themePanelLoaded) return;
  window.__themePanelLoaded = true;

  /* ------------------------------------------------------------
     1. Load HTML from module folder
  ------------------------------------------------------------ */
  async function loadPanelHTML() {
    const res = await fetch("/test/theme-panel/theme-panel.html?v=" + Date.now());
    const html = await res.text();

    const wrapper = document.createElement("div");
    wrapper.innerHTML = html.trim();

    panel = wrapper.firstElementChild;
    document.body.appendChild(panel);

    requestAnimationFrame(() => panel.classList.add("theme-panel-ready"));
  }

  /* ------------------------------------------------------------
     2. Apply Background Mode
  ------------------------------------------------------------ */
  function applyBackground(mode) {
    if (mode === "night") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    localStorage.setItem(BG_KEY, mode);

    document.dispatchEvent(new CustomEvent("theme-changed", { detail: mode }));
  }

  /* ------------------------------------------------------------
     3. Load Saved Background Mode
  ------------------------------------------------------------ */
  function loadSavedBackground() {
    const saved = localStorage.getItem(BG_KEY) || "day";
    applyBackground(saved);
  }

  /* ------------------------------------------------------------
     4. Buttons
  ------------------------------------------------------------ */
  function initButtons() {
    const buttons = panel.querySelectorAll("[data-bg]");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        applyBackground(btn.dataset.bg);
      });
    });

    const resetBtn = panel.querySelector("#resetPanelPos");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        panel.style.left = "120px";
        panel.style.top = "120px";
        localStorage.removeItem(PANEL_POS_KEY);
      });
    }
  }

  /* ------------------------------------------------------------
     5. Dragging
  ------------------------------------------------------------ */
  function initDrag() {
    const header = panel.querySelector("#theme-panel-header");
    header.addEventListener("mousedown", e => {
      dragging = true;
      panel.classList.add("theme-panel-dragging");

      const rect = panel.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startLeft = rect.left;
      startTop = rect.top;

      e.preventDefault();
    });

    window.addEventListener("mousemove", e => {
      if (!dragging) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      panel.style.left = startLeft + dx + "px";
      panel.style.top = startTop + dy + "px";
    });

    window.addEventListener("mouseup", () => {
      if (!dragging) return;
      dragging = false;
      panel.classList.remove("theme-panel-dragging");

      const rect = panel.getBoundingClientRect();
      const pos = { x: rect.left, y: rect.top };
      localStorage.setItem(PANEL_POS_KEY, JSON.stringify(pos));
    });
  }

  /* ------------------------------------------------------------
     6. Toggle Visibility (SHIFT + T)
  ------------------------------------------------------------ */
  function initToggle() {
    window.addEventListener("keydown", e => {
      if (e.key === "T" && e.shiftKey) {
        panel.classList.toggle("theme-panel-visible");
      }
    });

    const closeBtn = panel.querySelector("#theme-panel-close");
    closeBtn.addEventListener("click", () => {
      panel.classList.remove("theme-panel-visible");
    });
  }

  /* ------------------------------------------------------------
     7. Load Saved Position
  ------------------------------------------------------------ */
  function loadPanelPosition() {
    const raw = localStorage.getItem(PANEL_POS_KEY);
    if (!raw) return;

    try {
      const pos = JSON.parse(raw);
      panel.style.left = pos.x + "px";
      panel.style.top = pos.y + "px";
    } catch (e) {
      console.warn("Theme panel pos parse error:", e);
    }
  }

  /* ------------------------------------------------------------
     8. Initialise Panel
  ------------------------------------------------------------ */
  async function initThemePanel() {
    await loadPanelHTML();
    loadPanelPosition();
    loadSavedBackground();
    initButtons();
    initDrag();
    initToggle();
  }

  window.initThemePanel = initThemePanel;

})();
