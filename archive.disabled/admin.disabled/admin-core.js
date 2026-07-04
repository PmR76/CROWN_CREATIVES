/* ============================================================
   CROWN CREATIVES — ADMIN CORE
   - Shift + A toggle
   - Admin panel UI
   - Shared helpers
   - Drag engine
   - Module loader (footer, ticker, header, pages)
============================================================ */

(function () {

  /* GLOBAL STATE */
  let adminMode = false;
  let selectedEl = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  const GRID_SIZE = 10;

  /* MODULE REGISTRY */
  CC.adminModules = CC.adminModules || {};

  /* ------------------------------------------------------------
     HELPERS
  ------------------------------------------------------------ */
  CC.admin = CC.admin || {};

  CC.admin.snapToGrid = (value) =>
    Math.round(value / GRID_SIZE) * GRID_SIZE;

  CC.admin.makeDraggablePositioned = (el) => {
    const rect = el.getBoundingClientRect();
    el.style.position = "absolute";
    el.style.left = `${rect.left + window.scrollX}px`;
    el.style.top = `${rect.top + window.scrollY}px`;
  };

  /* ------------------------------------------------------------
     ADMIN PANEL UI
  ------------------------------------------------------------ */
  function injectAdminPanel() {
    const panel = document.createElement("div");
    panel.id = "admin-panel";
    document.body.appendChild(panel);
    CC.admin.panel = panel;
    renderAdminPanel();
  }

  function removeAdminPanel() {
    const panel = document.getElementById("admin-panel");
    if (panel) panel.remove();
    CC.admin.panel = null;
  }

  CC.admin.currentPanel = "home";

  function renderAdminPanel() {
    const panel = CC.admin.panel;
    if (!panel) return;

    panel.innerHTML = `
      <div class="cc-admin-header">Crown Admin</div>

      <div class="cc-admin-section">
        <button data-panel="footer">Footer</button>
        <button data-panel="ticker">Ticker</button>
        <button data-panel="header">Header</button>
        <button data-panel="pages">Pages</button>
      </div>

      <div class="cc-admin-section">
        <button data-action="exit-admin">Exit Admin</button>
      </div>
    `;
  }

  /* ------------------------------------------------------------
     ADMIN MODE TOGGLE
  ------------------------------------------------------------ */
  function enableAdminMode() {
    if (adminMode) return;
    adminMode = true;

    document.body.classList.add("admin-mode");
    injectAdminPanel();

    /* Notify modules */
    Object.values(CC.adminModules).forEach(m => m.onEnable?.());
  }

  function disableAdminMode() {
    if (!adminMode) return;
    adminMode = false;

    document.body.classList.remove("admin-mode");
    removeAdminPanel();

    /* Notify modules */
    Object.values(CC.adminModules).forEach(m => m.onDisable?.());
  }

  document.addEventListener("keydown", (e) => {
    if (e.shiftKey && e.key.toLowerCase() === "a") {
      adminMode ? disableAdminMode() : enableAdminMode();
    }
  });

  /* ------------------------------------------------------------
     PANEL CLICK HANDLER
  ------------------------------------------------------------ */
  document.addEventListener("click", (e) => {
    if (!adminMode) return;

    const panelTarget = e.target.dataset.panel;
    const action = e.target.dataset.action;

    if (panelTarget) {
      CC.admin.currentPanel = panelTarget;
      CC.adminModules[panelTarget]?.renderPanel?.();
      return;
    }

    if (action === "exit-admin") {
      disableAdminMode();
      return;
    }

    /* Delegate actions to modules */
    Object.values(CC.adminModules).forEach(m => m.onAction?.(action));
  });

  /* ------------------------------------------------------------
     DRAG ENGINE (shared)
  ------------------------------------------------------------ */
  document.addEventListener("mousedown", (e) => {
    if (!adminMode) return;

    let target = e.target.closest("[data-admin-draggable]");
    if (!target) return;

    selectedEl = target;
    CC.admin.makeDraggablePositioned(selectedEl);

    dragOffsetX = e.clientX - selectedEl.offsetLeft;
    dragOffsetY = e.clientY - selectedEl.offsetTop;

    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", dragStop);

    e.preventDefault();
  });

  function dragMove(e) {
    if (!selectedEl || !adminMode) return;

    const x = CC.admin.snapToGrid(e.clientX - dragOffsetX);
    const y = CC.admin.snapToGrid(e.clientY - dragOffsetY);

    selectedEl.style.left = `${x}px`;
    selectedEl.style.top = `${y}px`;
  }

  function dragStop() {
    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("mouseup", dragStop);

    /* Notify module */
    const moduleName = selectedEl.dataset.adminModule;
    CC.adminModules[moduleName]?.onDragEnd?.(selectedEl);

    selectedEl = null;
  }

})();
