/* ============================================================
   CROWN CREATIVES — ADMIN MODE (Unified Build)
   Simple selection, drag with snapping, delete, layout save,
   reset, footer restore, rotation, scaling, snap-to-center.
============================================================ */

/* ------------------------------------------------------------
   GLOBAL CC STUB (prevents "CC is not defined" crashes)
------------------------------------------------------------ */
(function () {
  if (!window.CC) {
    window.CC = {};
  }
  if (typeof window.CC.log !== "function") {
    window.CC.log = function () {
      console.log.apply(console, arguments);
    };
  }
})();

/* ------------------------------------------------------------
   STATE
------------------------------------------------------------ */
(function () {
  let adminMode = false;
  let selectedEl = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  const GRID_SIZE = 10;

  /* ----------------------------------------------------------
     HELPERS
  ---------------------------------------------------------- */
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

  /* ----------------------------------------------------------
     ADMIN MODE TOGGLE
  ---------------------------------------------------------- */
  function enableAdminMode() {
    adminMode = true;
    document.body.classList.add("admin-mode");
    injectAdminPanel();
    addDragHandles();
    console.log("ADMIN MODE ENABLED");
  }

  function disableAdminMode() {
    adminMode = false;
    selectedEl = null;
    document.body.classList.remove("admin-mode");
    removeAdminPanel();
    removeDragHandles();
    console.log("ADMIN MODE DISABLED");
  }

  /* ----------------------------------------------------------
     ADMIN PANEL UI
  ---------------------------------------------------------- */
  function injectAdminPanel() {
    if (document.getElementById("admin-panel")) return;

    const panel = document.createElement("div");
    panel.id = "admin-panel";

    panel.innerHTML = `
      <button id="admin-save">💾 Save Layout</button>
      <button id="admin-reset">♻️ Reset Layout</button>
      <button id="admin-snap-center">🎯 Snap Center</button>
      <button id="admin-rotate-left">⟲ Rotate -15°</button>
      <button id="admin-rotate-right">⟳ Rotate +15°</button>
      <button id="admin-scale-up">➕ Scale Up</button>
      <button id="admin-scale-down">➖ Scale Down</button>
      <button id="admin-restore-footer">🛠 Restore Footer</button>
      <button id="admin-exit">🚪 Exit Admin</button>
    `;

    document.body.appendChild(panel);

    document.getElementById("admin-save").onclick = saveLayout;
    document.getElementById("admin-reset").onclick = resetLayout;
    document.getElementById("admin-snap-center").onclick = () => {
      if (selectedEl) centerInFooter(selectedEl);
    };
    document.getElementById("admin-rotate-left").onclick = () => rotateSelected(-15);
    document.getElementById("admin-rotate-right").onclick = () => rotateSelected(15);
    document.getElementById("admin-scale-up").onclick = () => scaleSelected(0.1);
    document.getElementById("admin-scale-down").onclick = () => scaleSelected(-0.1);
    document.getElementById("admin-restore-footer").onclick = restoreFooter;
    document.getElementById("admin-exit").onclick = disableAdminMode;
  }

  function removeAdminPanel() {
    const panel = document.getElementById("admin-panel");
    if (panel) panel.remove();
  }

  /* ----------------------------------------------------------
     DRAG HANDLES
  ---------------------------------------------------------- */
  function addDragHandles() {
    const icons = document.querySelectorAll(".footer-icon");
    icons.forEach(icon => {
      if (icon.querySelector(".drag-handle")) return;
      const handle = document.createElement("div");
      handle.className = "drag-handle";
      handle.dataset.handle = "true";
      handle.style.position = "absolute";
      handle.style.right = "-6px";
      handle.style.bottom = "-6px";
      handle.style.width = "12px";
      handle.style.height = "12px";
      handle.style.borderRadius = "50%";
      handle.style.background = "rgba(255,255,255,0.9)";
      handle.style.boxShadow = "0 0 6px rgba(0,0,0,0.6)";
      handle.style.cursor = "grab";
      handle.style.zIndex = "10000";
      icon.style.position = icon.style.position || "relative";
      icon.appendChild(handle);
    });
  }

  function removeDragHandles() {
    const handles = document.querySelectorAll(".drag-handle");
    handles.forEach(h => h.remove());
  }

  /* ----------------------------------------------------------
     SIMPLE OBJECT IDENTIFICATION
  ---------------------------------------------------------- */
  document.addEventListener("click", (e) => {
    if (!adminMode) return;

    const target = e.target;

    // Only intercept clicks on icons or drag handles
    if (target.classList.contains("footer-icon") || target.dataset.handle === "true") {
      const icon = target.classList.contains("footer-icon") ? target : target.closest(".footer-icon");
      if (!icon) return;
      selectedEl = icon;
      console.log("Selected:", selectedEl.dataset.id);
      e.preventDefault();
      e.stopPropagation();
    }
  });

  /* ----------------------------------------------------------
     SIMPLE DRAG SYSTEM WITH GRID SNAPPING
  ---------------------------------------------------------- */
  document.addEventListener("mousedown", (e) => {
    if (!adminMode) return;

    let target = e.target;
    if (target.dataset.handle === "true") {
      target = target.closest(".footer-icon");
    }

    if (!target || !target.classList.contains("footer-icon")) return;

    selectedEl = target;
    makeDraggablePositioned(selectedEl);

    dragOffsetX = e.clientX - selectedEl.offsetLeft;
    dragOffsetY = e.clientY - selectedEl.offsetTop;

    selectedEl.style.zIndex = "9999";

    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", dragStop);

    e.preventDefault();
  });

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

  /* ----------------------------------------------------------
     SIMPLE DELETE SYSTEM (optional API)
  ---------------------------------------------------------- */
  function deleteSelected() {
    if (!adminMode || !selectedEl) return;
    console.log("Deleted:", selectedEl.dataset.id);
    selectedEl.remove();
    selectedEl = null;
  }

  /* ----------------------------------------------------------
     ROTATION & SCALING
  ---------------------------------------------------------- */
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

  /* ----------------------------------------------------------
     FOOTER RESTORE BUTTON
  ---------------------------------------------------------- */
  function restoreFooter() {
    const footer = document.getElementById("cc-footer");
    if (!footer) return;

    footer.innerHTML = `
      <div class="footer-glass">

        <div class="footer-icons" id="footer-icons">
          <img src="/assets/icons/facebook.svg" class="footer-icon" data-id="facebook">
          <img src="/assets/icons/instagram.svg" class="footer-icon" data-id="instagram">
          <img src="/assets/icons/email.svg" class="footer-icon" data-id="email">
          <img src="/assets/icons/copilot.svg" class="footer-icon" data-id="copilot">
        </div>

        <button id="back-to-top" class="back-to-top">▲</button>

        <div class="footer-copy">
          © 2026 Crown Creatives — All Rights Reserved<br>
          Royalty‑Free Music Provided by Pixabay
        </div>

      </div>
    `;

    wireFooterBasics();
    loadSavedLayout(); // if any
    if (adminMode) {
      addDragHandles();
    }

    console.log("Footer restored to default state");
  }

  /* ----------------------------------------------------------
     SAVE / LOAD LAYOUT
  ---------------------------------------------------------- */
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

  /* ----------------------------------------------------------
     FOOTER WIRING (back-to-top, etc.)
  ---------------------------------------------------------- */
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

  /* ----------------------------------------------------------
     PUBLIC API
  ---------------------------------------------------------- */
  window.CC = window.CC || {};
  window.CC.admin = {
    enable: enableAdminMode,
    disable: disableAdminMode,
    deleteSelected,
    saveLayout,
    resetLayout,
    restoreFooter
  };
})();
