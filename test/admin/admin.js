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
!function(){window.CC||(window.CC={}),"function"!=typeof window.CC.log&&(window.CC.log=function(){console.log.apply(console,arguments)})}(),function(){let e=!1,t=null,o=0,n=0;const a=10;function d(e,t,o){const n=t||0,a=o||1;e.style.transform=`rotate(${n}deg) scale(${a})`}function l(e){return{rotation:parseFloat(e.dataset.rotation||"0"),scale:parseFloat(e.dataset.scale||"1")}}function c(e){return Math.round(e/a)*a}function s(e){const t=document.getElementById("footer-icons");if(!t)return;const o=t.getBoundingClientRect(),n=e.getBoundingClientRect(),a=o.left+o.width/2-n.width/2,d=o.top+o.height/2-n.height/2,l=c(a+window.scrollX),s=c(d+window.scrollY);e.style.position="absolute",e.style.left=`${l}px`,e.style.top=`${s}px`}function i(e){const t=e.getBoundingClientRect();e.style.position="absolute",e.style.left=`${t.left+window.scrollX}px`,e.style.top=`${t.top+window.scrollY}px`}function r(){e=!0,document.body.classList.add("admin-mode"),m(),u(),console.log("ADMIN MODE ENABLED")}function p(){e=!1,t=null,document.body.classList.remove("admin-mode"),f(),h(),console.log("ADMIN MODE DISABLED")}function m(){if(document.getElementById("admin-panel"))return;const e=document.createElement("div");e.id="admin-panel",e.innerHTML='\n      <button id="admin-save">\ud83d\udcbe Save Layout</button>\n      <button id="admin-reset">\u267b\ufe0f Reset Layout</button>\n      <button id="admin-snap-center">\ud83c\udfaf Snap Center</button>\n      <button id="admin-rotate-left">\u27f2 Rotate -15\u00b0</button>\n      <button id="admin-rotate-right">\u27f3 Rotate +15\u00b0</button>\n      <button id="admin-scale-up">\u2795 Scale Up</button>\n      <button id="admin-scale-down">\u2796 Scale Down</button>\n      <button id="admin-restore-footer">\ud83d\udee0 Restore Footer</button>\n      <button id="admin-exit">\ud83d\udeaa Exit Admin</button>\n    ',document.body.appendChild(e),document.getElementById("admin-save").onclick=g,document.getElementById("admin-reset").onclick=v,document.getElementById("admin-snap-center").onclick=(()=>{t&&s(t)}),document.getElementById("admin-rotate-left").onclick=(()=>y(-15)),document.getElementById("admin-rotate-right").onclick=(()=>y(15)),document.getElementById("admin-scale-up").onclick=(()=>E(.1)),document.getElementById("admin-scale-down").onclick=(()=>E(-.1)),document.getElementById("admin-restore-footer").onclick=w,document.getElementById("admin-exit").onclick=p}function f(){const e=document.getElementById("admin-panel");e&&e.remove()}function u(){document.querySelectorAll(".footer-icon").forEach((e=>{if(e.querySelector(".drag-handle"))return;const t=document.createElement("div");t.className="drag-handle",t.dataset.handle="true",t.style.position="absolute",t.style.right="-6px",t.style.bottom="-6px",t.style.width="12px",t.style.height="12px",t.style.borderRadius="50%",t.style.background="rgba(255,255,255,0.9)",t.style.boxShadow="0 0 6px rgba(0,0,0,0.6)",t.style.cursor="grab",t.style.zIndex="10000",e.style.position=e.style.position||"relative",e.appendChild(t)}))}function h(){document.querySelectorAll(".drag-handle").forEach((e=>e.remove()))}function y(e){if(!t)return;const o=l(t),n=o.rotation+e;t.dataset.rotation=n,d(t,n,o.scale)}function E(e){if(!t)return;const o=l(t);let n=o.scale+e;n<.2&&(n=.2),n>3&&(n=3),t.dataset.scale=n,d(t,o.rotation,n)}function w(){const e=document.getElementById("cc-footer");e&&(e.innerHTML='\n      <div class="footer-glass">\n\n        <div class="footer-icons" id="footer-icons">\n          <img src="/assets/icons/facebook.svg" class="footer-icon" data-id="facebook">\n          <img src="/assets/icons/instagram.svg" class="footer-icon" data-id="instagram">\n          <img src="/assets/icons/email.svg" class="footer-icon" data-id="email">\n          <img src="/assets/icons/copilot.svg" class="footer-icon" data-id="copilot">\n        </div>\n\n        <button id="back-to-top" class="back-to-top">\u25b2</button>\n\n        <div class="footer-copy">\n          \u00a9 2026 Crown Creatives \u2014 All Rights Reserved<br>\n          Royalty\u2011Free Music Provided by Pixabay\n        </div>\n\n      </div>\n    ',b(),L(),e&&console.log("Footer restored to default state"))}function g(){const e=[...document.querySelectorAll(".footer-icon")],t=e.map((e=>{const t=l(e);return{id:e.dataset.id,left:e.style.left||null,top:e.style.top||null,rotation:t.rotation,scale:t.scale}}));localStorage.setItem("cc-footer-layout",JSON.stringify(t)),console.log("Layout saved:",t)}function v(){localStorage.removeItem("cc-footer-layout"),w(),console.log("Layout reset to default")}function L(){const e=localStorage.getItem("cc-footer-layout");if(!e)return;const t=JSON.parse(e);t.forEach((e=>{const t=document.querySelector(`.footer-icon[data-id="${e.id}"]`);t&&(e.left&&(t.style.position="absolute",t.style.left=e.left),e.top&&(t.style.position="absolute",t.style.top=e.top),t.dataset.rotation=e.rotation||0,t.dataset.scale=e.scale||1,d(t,e.rotation,e.scale))})),console.log("Loaded saved layout")}function b(){const e=document.getElementById("back-to-top");e&&e.addEventListener("click",(()=>{window.scrollTo({top:0,behavior:"smooth"})}))}document.addEventListener("click",(o=>{if(!e)return;const n=o.target;if(n.classList.contains("footer-icon")||"true"===n.dataset.handle){const e=n.classList.contains("footer-icon")?n:n.closest(".footer-icon");e&&(t=e,console.log("Selected:",t.dataset.id),o.preventDefault(),o.stopPropagation())}})),document.addEventListener("mousedown",(a=>{if(!e)return;let d=a.target;if("true"===d.dataset.handle&&(d=d.closest(".footer-icon")),!d||!d.classList.contains("footer-icon"))return;t=d,i(t),o=a.clientX-t.offsetLeft,n=a.clientY-t.offsetTop,t.style.zIndex="9999",document.addEventListener("mousemove",function o(a){if(!t||!e)return;const d=c(a.clientX-((o=t).offsetLeft+0)),l=c(a.clientY-((n=o).offsetTop+0));var o,n;t.style.left=`${d}px`,t.style.top=`${l}px`}),document.addEventListener("mouseup",(function o(){document.removeEventListener("mousemove",arguments.callee),document.removeEventListener("mouseup",o)})),a.preventDefault()})),document.addEventListener("DOMContentLoaded",(()=>{b(),L()})),window.CC=window.CC||{},window.CC.admin={enable:r,disable:p,deleteSelected:function(){e&&t&&(console.log("Deleted:",t.dataset.id),t.remove(),t=null)},saveLayout:g,resetLayout:v,restoreFooter:w}}();
