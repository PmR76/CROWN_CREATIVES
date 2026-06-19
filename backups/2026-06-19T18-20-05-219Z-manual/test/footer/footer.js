/* ============================================================
   CROWN CREATIVES — FOOTER ENGINE (GR1)
   Draggable icons, draggable panel, admin mode toggle,
   back-to-top engine, persistent positions.
============================================================ */

/* ------------------------------------------------------------
   1. ADMIN MODE TOGGLE (Shift + A)
------------------------------------------------------------ */
let adminMode = false;

document.addEventListener("keydown", e => {
  if (e.key === "A" && e.shiftKey) {
    adminMode = !adminMode;
    document.body.classList.toggle("admin-mode", adminMode);
  }
});

/* ------------------------------------------------------------
   2. DRAGGABLE ICONS
------------------------------------------------------------ */
const icons = document.querySelectorAll(".footer-icon");

icons.forEach(icon => {
  const id = icon.dataset.id;

  // Restore saved position
  const saved = localStorage.getItem("footer-pos-" + id);
  if (saved) {
    const pos = JSON.parse(saved);
    icon.style.position = "absolute";
    icon.style.left = pos.x + "px";
    icon.style.top = pos.y + "px";
  }

  let offsetX = 0;
  let offsetY = 0;

  icon.addEventListener("mousedown", e => {
    if (!adminMode) return;

    icon.style.position = "absolute";

    offsetX = e.clientX - icon.offsetLeft;
    offsetY = e.clientY - icon.offsetTop;

    function move(e) {
      icon.style.left = e.clientX - offsetX + "px";
      icon.style.top = e.clientY - offsetY + "px";
    }

    function stop() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", stop);

      // Save position
      localStorage.setItem("footer-pos-" + id, JSON.stringify({
        x: icon.offsetLeft,
        y: icon.offsetTop
      }));
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stop);
  });
});

/* ------------------------------------------------------------
   3. DRAGGABLE FOOTER PANEL (optional)
------------------------------------------------------------ */
const footerGlass = document.querySelector(".footer-glass");

if (footerGlass) {
  let offsetX = 0;
  let offsetY = 0;

  footerGlass.addEventListener("mousedown", e => {
    if (!adminMode) return;

    footerGlass.style.position = "absolute";

    offsetX = e.clientX - footerGlass.offsetLeft;
    offsetY = e.clientY - footerGlass.offsetTop;

    function move(e) {
      footerGlass.style.left = e.clientX - offsetX + "px";
      footerGlass.style.top = e.clientY - offsetY + "px";
    }

    function stop() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", stop);
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stop);
  });
}

/* ------------------------------------------------------------
   4. BACK TO TOP BUTTON
------------------------------------------------------------ */
const backToTop = document.getElementById("back-to-top");

if (backToTop) {
  backToTop.onclick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}
