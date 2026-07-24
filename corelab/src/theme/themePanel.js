// ============================================================
// themePanel.js — SHIFT+T Theme Panel + Page Themes + Gradients
// ============================================================

window.initThemePanel = function () {
  const panel = document.getElementById("theme-panel");
  if (!panel) return;

  // SHIFT + T toggle
  window.addEventListener("keydown", (e) => {
    if (e.shiftKey && e.key.toLowerCase() === "t") {
      panel.style.display =
        panel.style.display === "block" ? "none" : "block";
    }
  });

  // Apply gradient
  const applyTheme = (gradient) => {
    document.documentElement.style.setProperty("--cc-page-background", gradient);
    window.dispatchEvent(new Event("themeChanged"));
  };

  // Page‑specific themes
  const pageThemes = {
    home: "linear-gradient(135deg, #1e3c72, #2a5298)",
    about: "linear-gradient(135deg, #42275a, #734b6d)",
    gallery: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    projects: "linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b)",
    videos: "linear-gradient(135deg, #141e30, #243b55)",
    podcasts: "linear-gradient(135deg, #1d4350, #a43931)",
    contact: "linear-gradient(135deg, #232526, #414345)",
    blog: "linear-gradient(135deg, #373b44, #4286f4)",
  };

  // Populate panel
  const list = document.getElementById("theme-panel-background-list");
  if (list) {
    Object.entries(pageThemes).forEach(([page, gradient]) => {
      const btn = document.createElement("button");
      btn.textContent = page;
      btn.onclick = () => applyTheme(gradient);
      list.appendChild(btn);
    });
  }
};
