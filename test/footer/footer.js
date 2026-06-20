/* ============================================================
   CROWN CREATIVES — FOOTER ENGINE (GR1, UNIFIED ADMIN MODE)
   Uses global CC.admin + CC.drag helpers
============================================================ */

/* ------------------------------------------------------------
   1. DRAGGABLE ICONS (ADMIN MODE ONLY)
------------------------------------------------------------ */
const icons = document.querySelectorAll(".footer-icon");

icons.forEach(icon => {
  const id = icon.dataset.id;

  // Use global draggable helper with persistent storage
  CC.drag.makeDraggable(icon, {
    key: "footer-pos-" + id
  });
});


/* ------------------------------------------------------------
   2. DRAGGABLE FOOTER PANEL (ADMIN MODE ONLY)
------------------------------------------------------------ */
const footerGlass = document.querySelector(".footer-glass");

if (footerGlass) {
  CC.drag.makeDraggable(footerGlass, {
    key: "footer-glass-pos"
  });
}


/* ------------------------------------------------------------
   3. BACK TO TOP BUTTON
------------------------------------------------------------ */
const backToTop = document.getElementById("back-to-top");

if (backToTop) {
  backToTop.onclick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}
