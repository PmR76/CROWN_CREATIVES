/* ============================================================
   THEME CONTROL PANEL — JS Controller
   - Opens/closes panel
   - Switches themes
   - Admin reset tools
   - Draggable panel
============================================================ */

window.initThemePanel = function () {

  const panel = document.getElementById("themePanel");
  const closeBtn = document.getElementById("themePanelClose");
  const themeButtons = document.querySelectorAll(".theme-options button");

  const isAdmin = true; // later: tie to login

  /* ------------------------------
     1. Open panel (admin only)
  ------------------------------ */
  if (isAdmin) {
    document.addEventListener("keydown", (e) => {
      if (e.key === "T") {
        panel.style.display = "block";
      }
    });
  }

  /* ------------------------------
     2. Close panel
  ------------------------------ */
  closeBtn.addEventListener("click", () => {
    panel.style.display = "none";
  });

  /* ------------------------------
     3. Theme switching
  ------------------------------ */
  themeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;
      document.body.setAttribute("data-theme", theme);
      localStorage.setItem("cc-theme", theme);

      if (window.updateCrown) window.updateCrown(theme);
      if (window.updateBackground) window.updateBackground(theme);
    });
  });

  /* ------------------------------
     4. Admin reset tools
  ------------------------------ */
  document.getElementById("resetTogglePos").addEventListener("click", () => {
    localStorage.removeItem("cc-theme-toggle-pos");
    location.reload();
  });

  document.getElementById("resetToggleSize").addEventListener("click", () => {
    localStorage.removeItem("cc-theme-toggle-size");
    location.reload();
  });

  /* ------------------------------
     5. Draggable panel
  ------------------------------ */
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  const header = document.querySelector(".theme-panel-header");

  header.addEventListener("mousedown", (e) => {
    dragging = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    panel.style.left = `${e.clientX - offsetX}px`;
    panel.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
  });
};
