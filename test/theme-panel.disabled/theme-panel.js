/* ============================================================
   THEME PANEL MODULE (BACKGROUND ONLY)
   - Admin-only panel
   - SHIFT + P to toggle
   - Draggable
   - Page-specific background themes
============================================================ */

(function () {
  const THEMES_URL = "/assets/backgrounds/themes.json";
  const STORAGE_KEY = "pageBackgroundTheme";
  const PANEL_POS_KEY = "themePanelPos";

  let panel = null;
  let bgData = null;
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  function getPageKey() {
    return document.body.getAttribute("data-page") || "home";
  }

  function applyBackground(themeId) {
    if (!bgData) return;
    const pageKey = getPageKey();
    const theme = bgData[pageKey] || bgData["home"];
    if (!theme) return;

    const gradient = theme.gradient;
    document.documentElement.style.setProperty("--cc-page-background", gradient);
    document.body.style.backgroundImage = gradient;

    localStorage.setItem(STORAGE_KEY + ":" + pageKey, themeId || theme.id || pageKey);
  }

  async function loadThemes() {
    try {
      const res = await fetch(THEMES_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("Theme JSON missing");
      bgData = await res.json();
    } catch (e) {
      console.warn("Theme panel: failed to load themes.json", e);
      bgData = null;
    }
  }

  function createPanel() {
    if (panel) return panel;

    panel = document.createElement("div");
    panel.id = "theme-panel";
    panel.classList.add("cc-theme-panel");

    panel.innerHTML = `
      <div id="theme-panel-header">
        <div id="theme-panel-title">Background Theme</div>
        <div id="theme-panel-close">✕</div>
      </div>
      <div class="theme-panel-section-label">Page Presets</div>
      <div id="theme-panel-background-list"></div>
    `;

    document.body.appendChild(panel);
    return panel;
  }

  function populatePanel() {
    if (!panel || !bgData) return;

    const list = panel.querySelector("#theme-panel-background-list");
    list.innerHTML = "";

    const pageKey = getPageKey();
    const theme = bgData[pageKey] || bgData["home"];
    if (!theme) return;

    const option = document.createElement("div");
    option.className = "theme-panel-bg-option active";
    option.dataset.themeId = theme.id || pageKey;
    option.innerHTML = `<span>${theme.label || ("Theme: " + pageKey)}</span>`;

    option.addEventListener("click", () => {
      applyBackground(option.dataset.themeId);
    });

    list.appendChild(option);
  }

  function loadPanelPosition() {
    const raw = localStorage.getItem(PANEL_POS_KEY);
    if (!raw) return;
    try {
      const pos = JSON.parse(raw);
      if (typeof pos.x === "number" && typeof pos.y === "number") {
        panel.style.left = pos.x + "px";
        panel.style.top = pos.y + "px";
      }
    } catch (e) {
      console.warn("Theme panel pos parse error:", e);
    }
  }

  function savePanelPosition() {
    const rect = panel.getBoundingClientRect();
    const pos = {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY
    };
    localStorage.setItem(PANEL_POS_KEY, JSON.stringify(pos));
  }

  function initDrag() {
    const header = panel.querySelector("#theme-panel-header");
    if (!header) return;

    header.addEventListener("mousedown", e => {
      dragging = true;
      panel.classList.add("theme-panel-dragging");

      const rect = panel.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startLeft = rect.left + window.scrollX;
      startTop = rect.top + window.scrollY;

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
      savePanelPosition();
    });
  }

  function initToggle() {
    // SHIFT + P to toggle panel
    window.addEventListener("keydown", e => {
      if (e.key === "P" && e.shiftKey) {
        if (!panel) return;
        panel.classList.toggle("theme-panel-visible");
      }
    });

    const closeBtn = panel.querySelector("#theme-panel-close");
    closeBtn.addEventListener("click", () => {
      panel.classList.remove("theme-panel-visible");
    });
  }

  async function initThemePanel() {
    createPanel();
    loadPanelPosition();
    await loadThemes();
    populatePanel();
    applyBackground(); // initial
    initDrag();
    initToggle();
  }

  // Expose for master.js
  window.initThemePanel = initThemePanel;
})();
