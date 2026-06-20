/* ============================================================
   CROWN CREATIVES — ADMIN MODE (Unified Build)
   Simple object selection, dragging, deleting, and footer restore.
============================================================ */

/* ------------------------------------------------------------
   STATE
------------------------------------------------------------ */
let adminMode = false;
let selectedEl = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

/* ------------------------------------------------------------
   ENABLE / DISABLE ADMIN MODE
------------------------------------------------------------ */
export function enableAdminMode() {
  adminMode = true;
  document.body.classList.add("admin-mode");
  console.log("ADMIN MODE ENABLED");
}

export function disableAdminMode() {
  adminMode = false;
  selectedEl = null;
  document.body.classList.remove("admin-mode");
  console.log("ADMIN MODE DISABLED");
}

/* ------------------------------------------------------------
   SIMPLE OBJECT IDENTIFICATION
------------------------------------------------------------ */
document.addEventListener("click", (e) => {
  if (!adminMode) return;

  const target = e.target;

  // Only allow selecting draggable items
  if (target.classList.contains("footer-icon")) {
    selectedEl = target;
    console.log("Selected:", selectedEl.dataset.id);
  }

  // Prevent normal click behavior in admin mode
  e.preventDefault();
});

/* ------------------------------------------------------------
   SIMPLE DRAG SYSTEM
------------------------------------------------------------ */
document.addEventListener("mousedown", (e) => {
  if (!adminMode || !selectedEl) return;

  dragOffsetX = e.clientX - selectedEl.offsetLeft;
  dragOffsetY = e.clientY - selectedEl.offsetTop;

  selectedEl.style.position = "absolute";
  selectedEl.style.zIndex = "9999";

  document.addEventListener("mousemove", dragMove);
  document.addEventListener("mouseup", dragStop);
});

function dragMove(e) {
  if (!selectedEl) return;

  selectedEl.style.left = `${e.clientX - dragOffsetX}px`;
  selectedEl.style.top = `${e.clientY - dragOffsetY}px`;
}

function dragStop() {
  document.removeEventListener("mousemove", dragMove);
  document.removeEventListener("mouseup", dragStop);
}

/* ------------------------------------------------------------
   SIMPLE DELETE SYSTEM
------------------------------------------------------------ */
export function deleteSelected() {
  if (!adminMode || !selectedEl) return;

  console.log("Deleted:", selectedEl.dataset.id);
  selectedEl.remove();
  selectedEl = null;
}

/* ------------------------------------------------------------
   FOOTER RESTORE BUTTON
------------------------------------------------------------ */
export function restoreFooter() {
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

  console.log("Footer restored to default state");
}

/* ------------------------------------------------------------
   CLEAN ADMIN PANEL (API)
------------------------------------------------------------ */
export const AdminAPI = {
  enable: enableAdminMode,
  disable: disableAdminMode,
  delete: deleteSelected,
  restoreFooter: restoreFooter,
};

/* ------------------------------------------------------------
   FOOTER WIRING
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
function injectAdminPanel() {
  if (document.getElementById("admin-panel")) return;

  const panel = document.createElement("div");
  panel.id = "admin-panel";

  panel.innerHTML = `
    <button id="admin-save">💾 Save Layout</button>
    <button id="admin-reset">♻️ Reset Layout</button>
    <button id="admin-restore-footer">🛠 Restore Footer</button>
    <button id="admin-exit">🚪 Exit Admin</button>
  `;

  document.body.appendChild(panel);

  document.getElementById("admin-save").onclick = saveLayout;
  document.getElementById("admin-reset").onclick = resetLayout;
  document.getElementById("admin-restore-footer").onclick = restoreFooter;
  document.getElementById("admin-exit").onclick = disableAdminMode;
}
function saveLayout() {
  const icons = [...document.querySelectorAll(".footer-icon")];

  const layout = icons.map(icon => ({
    id: icon.dataset.id,
    left: icon.style.left || null,
    top: icon.style.top || null
  }));

  localStorage.setItem("cc-footer-layout", JSON.stringify(layout));
  console.log("Layout saved:", layout);
}
function resetLayout() {
  localStorage.removeItem("cc-footer-layout");
  restoreFooter();
  console.log("Layout reset to default");
}
function dragMove(e) {
  if (!selectedEl) return;

  const rawX = e.clientX - dragOffsetX;
  const rawY = e.clientY - dragOffsetY;

  const snap = 10; // grid size

  const snappedX = Math.round(rawX / snap) * snap;
  const snappedY = Math.round(rawY / snap) * snap;

  selectedEl.style.left = `${snappedX}px`;
  selectedEl.style.top = `${snappedY}px`;
}
document.addEventListener("click", (e) => {
  if (!adminMode) return;  

  const target = e.target;

  // Only intercept clicks on draggable items
  if (target.classList.contains("footer-icon")) {
    selectedEl = target;
    console.log("Selected:", selectedEl.dataset.id);
    e.preventDefault();
  }
});
function loadSavedLayout() {
  const saved = localStorage.getItem("cc-footer-layout");
  if (!saved) return;

  const layout = JSON.parse(saved);

  layout.forEach(item => {
    const el = document.querySelector(`.footer-icon[data-id="${item.id}"]`);
    if (!el) return;

    if (item.left) el.style.left = item.left;
    if (item.top) el.style.top = item.top;
    el.style.position = "absolute";
  });

  console.log("Loaded saved layout");
}

document.addEventListener("DOMContentLoaded", loadSavedLayout);
