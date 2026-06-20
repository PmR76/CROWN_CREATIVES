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
