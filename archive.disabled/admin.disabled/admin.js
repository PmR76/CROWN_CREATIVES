/* ============================================================
   CROWN CREATIVES — ADMIN MODE (Unified Build)
   - Shift + A → toggle admin
   - Admin Home Panel + Module Panels
   - Footer icon selection + drag (snap to grid)
   - Rotate, scale, snap to center
   - Save / load layout
   - Restore footer to default
   - Edit footer text
   - Drag footer panel
============================================================ */

/* ------------------------------------------------------------
   GLOBAL CC STUB
------------------------------------------------------------ */
window.CC = window.CC || {};
CC.admin = CC.admin || {};
CC.drag = CC.drag || {
  makeDraggable(el, opts) {
    console.log("Legacy CC.drag.makeDraggable called:", el, opts);
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
  let textIsEditing = false;
  let speedMode = false;
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
    return {
      rotation: parseFloat(el.dataset.rotation || "0"),
      scale: parseFloat(el.dataset.scale || "1")
    };
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

    el.style.position = "absolute";
    el.style.left = `${snapToGrid(centerX + window.scrollX)}px`;
    el.style.top = `${snapToGrid(centerY + window.scrollY)}px`;
  }

  function makeDraggablePositioned(el) {
    const rect = el.getBoundingClientRect();
    el.style.position = "absolute";
    el.style.left = `${rect.left + window.scrollX}px`;
    el.style.top = `${rect.top + window.scrollY}px`;
  }

  /* ============================
     MISSING FUNCTIONS (RESTORED)
  ============================ */

  // 1. PANEL CREATION / REMOVAL
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

  // 2. DRAG HANDLES
  function addDragHandles() {
    const icons = document.querySelectorAll(".footer-icon");

    icons.forEach(icon => {
      if (icon.querySelector(".drag-handle")) return;

      const handle = document.createElement("div");
      handle.className = "drag-handle";
      handle.dataset.handle = "true";

      Object.assign(handle.style, {
        position: "absolute",
        right: "-6px",
        bottom: "-6px",
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.9)",
        boxShadow: "0 0 6px rgba(0,0,0,0.6)",
        cursor: "grab",
        zIndex: "10000"
      });

      icon.style.position = icon.style.position || "relative";
      icon.appendChild(handle);
    });

    const footerGlass = document.querySelector(".footer-glass");
    if (footerGlass && !footerGlass.querySelector(".drag-handle")) {
      const handle = document.createElement("div");
      handle.className = "drag-handle";
      handle.dataset.handle = "true";

      Object.assign(handle.style, {
        position: "absolute",
        right: "-6px",
        bottom: "-6px",
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.9)",
        boxShadow: "0 0 6px rgba(0,0,0,0.6)",
        cursor: "grab",
        zIndex: "10000"
      });

      footerGlass.style.position = footerGlass.style.position || "relative";
      footerGlass.appendChild(handle);
    }
  }

  function removeDragHandles() {
    document.querySelectorAll(".drag-handle").forEach(h => h.remove());
  }

  // 3. EDIT FOOTER TEXT
  function enableFooterTextEdit() {
    const copy = document.querySelector(".footer-copy");
    if (!copy) return;
    copy.contentEditable = "true";
    copy.style.outline = "2px dashed #4af";
    copy.style.padding = "4px";
    localStorage.setItem("cc-footer-copy", copy.innerHTML);

  }

  function disableFooterTextEdit() {
    const copy = document.querySelector(".footer-copy");
    if (!copy) return;
    copy.contentEditable = "false";
    copy.style.outline = "none";
  }

  /* ============================
     ADMIN MODE TOGGLE
  ============================ */
  function enableAdminMode() {
    if (adminMode) return;
    adminMode = true;

    document.body.classList.add("admin-mode");
    injectAdminPanel();
    addDragHandles();

    console.log("ADMIN MODE ENABLED");
  }

  function disableAdminMode() {
    if (!adminMode) return;
    adminMode = false;

    document.body.classList.remove("admin-mode");
    removeAdminPanel();
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
     ADMIN PANEL (HOME + MODULES)
  ============================ */

  CC.admin.currentPanel = "home";

  function renderAdminPanel() {
    const panel = CC.admin.panel;
    if (!panel) return;

    switch (CC.admin.currentPanel) {

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

      case "footer":
        panel.innerHTML = `
          <div class="cc-admin-header">Footer Controls</div>
          <div class="cc-admin-section">
            <button data-action="footer-edit-text">Edit Text</button>
            <button data-action="footer-restore">Restore Footer</button>
          </div>
          <div class="cc-admin-section">
            <button data-panel="home">Back to Home</button>
          </div>
        `;
        break;

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
    }
  }

  /* ============================
     PANEL CLICK HANDLER
  ============================ */
  document.addEventListener("click", (e) => {
    if (!adminMode) return;

    const panelTarget = e.target.dataset.panel;
    const action = e.target.dataset.action;

    if (panelTarget) {
      CC.admin.currentPanel = panelTarget;
      renderAdminPanel();
      return;
    }

    switch (action) {
      case "exit-admin":
        disableAdminMode();
        break;

      case "footer-edit-text":
        enableFooterTextEdit();
        break;

      case "footer-restore":
        restoreFooter();
        break;

      case "ticker-edit":
  if (textIsEditing) {
    CC.ticker.disableEdit();
    textIsEditing = false;
  } else {
    CC.ticker.enableEdit();
    textIsEditing = true;
  }
  break;

    case "ticker-speed":
  if (speedMode) {
    CC.ticker.disableSpeedMode();
    speedMode = false;
  } else {
    CC.ticker.enableSpeedMode();
    speedMode = true;
  }
  break;


      case "ticker-reset":
        CC.ticker?.reset?.();
        break;
    }
  });

  /* ============================
     DRAGGING WITH GRID SNAP
  ============================ */
  document.addEventListener("mousedown", (e) => {
    if (!adminMode) return;

    let target = e.target;

    if (target.dataset.handle === "true") {
      target = target.closest(".footer-icon, .footer-glass");
    }

    if (!target) return;

    if (!target.classList.contains("footer-icon") &&
        !target.classList.contains("footer-glass")) return;

    selectedEl = target;
    makeDraggablePositioned(selectedEl);

    dragOffsetX = e.clientX - selectedEl.offsetLeft;
    dragOffsetY = e.clientY - selectedEl.offsetTop;

    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", dragStop);

    e.preventDefault();
  });

  function dragMove(e) {
    if (!selectedEl || !adminMode) return;

    const rawX = e.clientX - dragOffsetX;
    const rawY = e.clientY - dragOffsetY;

    selectedEl.style.left = `${snapToGrid(rawX)}px`;
    selectedEl.style.top = `${snapToGrid(rawY)}px`;
  }

  function dragStop() {
    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("mouseup", dragStop);
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
    if (adminMode) addDragHandles();

    console.log("Footer restored");
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
     FOOTER BASICS
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
  CC.admin.restoreFooter = restoreFooter;
  CC.admin.saveLayout = saveLayout;
  CC.admin.resetLayout = () => {
    localStorage.removeItem("cc-footer-layout");
    restoreFooter();
  };

})();
