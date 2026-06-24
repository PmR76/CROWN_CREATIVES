/* ============================================================
   ADMIN‑ONLY THEME PANEL (PASSWORD + REMEMBER DEVICE)
============================================================ */

let isAdmin = false;

// Auto‑unlock if this laptop already authenticated
if (localStorage.getItem("cc-admin") === "true") {
  isAdmin = true;
}

// Ask for password on Shift+T
window.addEventListener("keydown", e => {
  if (e.key === "T" && e.shiftKey) {

    // If not admin yet → ask for password
    if (!isAdmin) {
      const pass = prompt("Enter admin password:");
      if (pass === "CROWN2026") {
        isAdmin = true;
        localStorage.setItem("cc-admin", "true");
        alert("Admin mode unlocked");
      } else {
        return; // wrong password → do nothing
      }
    }

    // Toggle panel visibility
    document.getElementById("theme-panel")
      .classList.toggle("theme-panel-visible");
  }
});


/* ============================================================
   PANEL LOGIC (DRAGGING + CLOSE BUTTON)
============================================================ */

(function () {
  const panel = document.getElementById("theme-panel");
  const header = document.getElementById("theme-panel-header");
  const closeBtn = document.getElementById("theme-panel-close");

  // Close button
  closeBtn.addEventListener("click", () => {
    panel.classList.remove("theme-panel-visible");
  });

  // DRAGGING
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  header.addEventListener("mousedown", e => {
    isDragging = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
    panel.style.transition = "none";
  });

  window.addEventListener("mousemove", e => {
    if (isDragging) {
      panel.style.left = `${e.clientX - offsetX}px`;
      panel.style.top = `${e.clientY - offsetY}px`;
    }
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
    panel.style.transition = "";
  });

})();
