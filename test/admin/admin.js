/* ============================================================
   CROWN CREATIVES — ADMIN MODE (Unified Build)
   One clean system:
   - Shift + A → toggle admin
   - Admin panel (Home + Modules)
   - Footer icon selection + drag (snap to grid)
   - Rotate, scale, snap to center
   - Save / load layout
   - Restore footer to default
   - Back-to-top wiring
============================================================ */

/* ------------------------------------------------------------
   GLOBAL CC STUB
------------------------------------------------------------ */
window.CC = window.CC || {};
CC.admin = CC.admin || {};
CC.drag = CC.drag || {
  // Fallback so legacy footer.js calls don't crash
  makeDraggable(el, opts) {
    console.log("CC.drag.makeDraggable called (legacy). Admin.js now handles dragging.", el, opts);
  }
};

/* ------------------------------------------------------------
   ADMIN SYSTEM
------------------------------------------------------------ */
(function () {
  let adminMode = false;
  let selectedEl = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  const GRID_SIZE = 10;

  /* ============================
     HELPERS
  ============================ */
  function applyTransform(el, rotationDeg, scaleVal) {
    const r = rotationDeg || 0;
    const s = scaleVal || 1;
    el.style.transform = `rotate(${r}deg) scale(${s})`;
  }

  function getTransformState(el) {
    const r = parseFloat(el.dataset.rotation || "0");
    const s = parseFloat(el.dataset.scale || "1");
    return { rotation: r, scale: s };
  }

  function snapToGrid(value) {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  }

  function centerInFooter(el) {
    const footerIcons = document.getElementById("footer-icons");
    if (!footerIcons) return;

    const rect = footerIcons.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2 - elRect.width / 2;
    const centerY = rect.top + rect.height / 2 - elRect.height / 2;

    const snappedX = snapToGrid(centerX + window.scrollX);
    const snappedY = snapToGrid(centerY + window.scrollY);

    el.style.position = "absolute";
    el.style.left = `${snappedX}px`;
    el.style.top = `${snappedY}px`;
  }

  function makeDraggablePositioned(el) {
    const rect = el.getBoundingClientRect();
    el.style.position = "absolute";
    el.style.left = `${rect.left + window.scrollX}px`;
    el.style.top = `${rect.top + window.scrollY}px`;
  }

  /* ============================
     ADMIN MODE TOGGLE
  ============================ */
function enableAdminMode() {
  if (adminMode) return;
  adminMode = true;

  document.body.classList.add("admin-mode");

  // Create panel container
  const panel = document.createElement("div");
  panel.id = "admin-panel";
  document.body.appendChild(panel);

  CC.admin.panel = panel;

  // Render the HOME panel
  renderAdminPanel();

  addDragHandles();
  console.log("ADMIN MODE ENABLED");
}
function disableAdminMode() {
  if (!adminMode) return;
  adminMode = false;

  document.body.classList.remove("admin-mode");

  // Remove panel container
  const panel = document.getElementById("admin-panel");
  if (panel) panel.remove();

  CC.admin.panel = null;

  removeDragHandles();
  selectedEl = null;

  console.log("ADMIN MODE DISABLED");
}

  document.addEventListener("keydown", (e) => {
    if (e.shiftKey && e.key.toLowerCase() === "a") {
      adminMode ? disableAdminMode() : enableAdminMode();
    }
  });

  /* ============================
     ADMIN PANEL (NEW HOME + MODULE PANELS)
  ============================ */

  CC.admin.currentPanel = "home";

  function renderAdminPanel() {
    const panel = CC.admin.panel;
    if (!panel) return;

    switch (CC.admin.currentPanel) {

      /* ============================
         HOME PANEL
      ============================ */
      case "home":
        panel.innerHTML = `
          <div class="cc-admin-header">Crown Admin</div>

          <div class="cc-admin-section">
            <button data-panel="footer">Footer</button>
            <button data-panel="ticker">Ticker</button>
            <button data-panel="header">Header</button>
            <button data-panel="main">Main Page</button>
            <button data-panel="add-page">Add Page</button>
          </div>

          <div class="cc-admin-section">
            <button data-action="exit-admin">Exit Admin</button>
          </div>
        `;
        break;

      /* ============================
         FOOTER PANEL
      ============================ */
      case "footer":
        panel.innerHTML = `
          <div class="cc-admin-header">Footer Controls</div>

          <div class="cc-admin-section">
            <button data-action="footer-resize">Resize Footer</button>
            <button data-action="footer-icons-edit">Edit Icons</button>
            <button data-action="footer-icons-add">Add Icon</button>
            <button data-action="footer-icons-remove">Remove Icon</button>
            <button data-action="footer-restore">Restore Footer</button>
          </div>

          <div class="cc-admin-section">
            <button data-panel="home">Back to Home</button>
          </div>
        `;
        break;

      /* ============================
         TICKER PANEL
      ============================ */
      case "ticker":
        panel.innerHTML = `
          <div class="cc-admin-header">Ticker Controls</div>

          <div class="cc-admin-section">
            <button data-action="ticker-edit">Edit Ticker</button>
            <button data-action="ticker-speed">Adjust Speed</button>
            <button data-action="ticker-reset">Reset Ticker</button>
          </div>

          <div class="cc-admin-section">
            <button data-panel="home">Back to Home</button>
          </div>
        `;
        break;

      default:
        panel.innerHTML = `<div class="cc-admin-header">Unknown Panel</div>`;
    }
  }

  /* ============================
     PANEL CLICK HANDLER
  ============================ */
  document.addEventListener("click", (e) => {
    if (!adminMode) return;

    const panel = CC.admin.panel;
    if (!panel) return;

    const panelTarget = e.target.dataset.panel;
    const action = e.target.dataset.action;

    /* Switch panels */
    if (panelTarget) {
      CC.admin.currentPanel = panelTarget;
      renderAdminPanel();
      return;
    }

    /* Handle actions */
    switch (action) {
      case "exit-admin":
        CC.admin.disable();
        break;

      /* FOOTER ACTIONS */
      case "footer-resize":
        CC.footer.resize && CC.footer.resize();
        break;

      case "footer-icons-edit":
        CC.footer.toggleIconEdit && CC.footer.toggleIconEdit();
        break;

      case "footer-icons-add":
        CC.footer.addIcon && CC.footer.addIcon();
        break;

      case "footer-icons-remove":
        CC.footer.removeIcon && CC.footer.removeIcon();
        break;

      case "footer-restore":
        CC.admin.restoreFooter && CC.admin.restoreFooter();
        break;

      /* TICKER ACTIONS */
      case "ticker-edit":
        document.body.classList.toggle("cc-ticker-edit");
        break;

      case "ticker-speed":
        document.body.classList.toggle("cc-ticker-speed-mode");
        break;

      case "ticker-reset":
        CC.ticker && CC.ticker.reset && CC.ticker.reset();
        break;
    }
  });
  /* ============================
     DRAGGING WITH GRID SNAP
  ============================ */
  function dragMove(e) {
    if (!selectedEl || !adminMode) return;

    const rawX = e.clientX - dragOffsetX;
    const rawY = e.clientY - dragOffsetY;

    const snappedX = snapToGrid(rawX);
    const snappedY = snapToGrid(rawY);

    selectedEl.style.left = `${snappedX}px`;
    selectedEl.style.top = `${snappedY}px`;
  }

  function dragStop() {
    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("mouseup", dragStop);
  }

  /* ============================
     DELETE SELECTED
  ============================ */
  function deleteSelected() {
    if (!adminMode || !selectedEl) return;
    console.log("Deleted:", selectedEl.dataset.id);
    selectedEl.remove();
    selectedEl = null;
  }

  /* ============================
     ROTATION & SCALING
  ============================ */
  function rotateSelected(deltaDeg) {
    if (!selectedEl) return;
    const state = getTransformState(selectedEl);
    const newR = state.rotation + deltaDeg;
    selectedEl.dataset.rotation = newR;
    applyTransform(selectedEl, newR, state.scale);
  }

  function scaleSelected(deltaScale) {
    if (!selectedEl) return;
    const state = getTransformState(selectedEl);
    let newS = state.scale + deltaScale;
    if (newS < 0.2) newS = 0.2;
    if (newS > 3) newS = 3;
    selectedEl.dataset.scale = newS;
    applyTransform(selectedEl, state.rotation, newS);
  }

  /* ============================
     FOOTER RESTORE
  ============================ */
  function restoreFooter() {
    const footer = document.getElementById("cc-footer");
    if (!footer) return;

    footer.innerHTML = `
      <div class="footer-glass">

        <div class="footer-icons" id="footer-icons">
          <img src="../assets/icons/facebook-magic.svg" class="footer-icon" data-id="facebook">
          <img src="../assets/icons/instagram-magic.svg" class="footer-icon" data-id="instagram">
          <img src="../assets/icons/email-magic.svg" class="footer-icon" data-id="email">
          <img src="../assets/icons/copilot-magic.svg" class="footer-icon" data-id="copilot">
        </div>

        <button id="back-to-top" class="back-to-top">▲</button>

        <div class="footer-copy">
          © 2026 Crown Creatives — All Rights Reserved<br>
          Royalty‑Free Music Provided by Pixabay
        </div>

      </div>
    `;

    wireFooterBasics();
    loadSavedLayout();
    if (adminMode) {
      addDragHandles();
    }

    console.log("Footer restored to default state");
  }

  /* ============================
     SAVE / LOAD LAYOUT
  ============================ */
  function saveLayout() {
    const icons = [...document.querySelectorAll(".footer-icon")];

    const layout = icons.map(icon => {
      const state = getTransformState(icon);
      return {
        id: icon.dataset.id,
        left: icon.style.left || null,
        top: icon.style.top || null,
        rotation: state.rotation,
        scale: state.scale
      };
    });

    localStorage.setItem("cc-footer-layout", JSON.stringify(layout));
    console.log("Layout saved:", layout);
  }

  function resetLayout() {
    localStorage.removeItem("cc-footer-layout");
    restoreFooter();
    console.log("Layout reset to default");
  }

  function loadSavedLayout() {
    const saved = localStorage.getItem("cc-footer-layout");
    if (!saved) return;

    const layout = JSON.parse(saved);

    layout.forEach(item => {
      const el = document.querySelector(`.footer-icon[data-id="${item.id}"]`);
      if (!el) return;

      if (item.left) {
        el.style.position = "absolute";
        el.style.left = item.left;
      }
      if (item.top) {
        el.style.position = "absolute";
        el.style.top = item.top;
      }

      el.dataset.rotation = item.rotation || 0;
      el.dataset.scale = item.scale || 1;
      applyTransform(el, item.rotation, item.scale);
    });

    console.log("Loaded saved layout");
  }

  /* ============================
     FOOTER BASICS (back-to-top)
  ============================ */
  function wireFooterBasics() {
    const backToTop = document.getElementById("back-to-top");
    if (backToTop) {
      backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireFooterBasics();
    loadSavedLayout();
  });

  /* ============================
     PUBLIC API
  ============================ */
  CC.admin.enable = enableAdminMode;
  CC.admin.disable = disableAdminMode;
  CC.admin.deleteSelected = deleteSelected;
  CC.admin.saveLayout = saveLayout;
  CC.admin.resetLayout = resetLayout;
  CC.admin.restoreFooter = restoreFooter;

})(); 
