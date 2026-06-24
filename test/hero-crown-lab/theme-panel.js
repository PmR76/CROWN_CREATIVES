/* TEST STATE */
(function () {
  const panel = document.getElementById("theme-panel");
  const header = document.getElementById("theme-panel-header");
  const closeBtn = document.getElementById("theme-panel-close");

  if (!panel) {
    console.warn("Theme panel missing in lab.");
    return;
  }

  // show/hide with Shift+T
  window.addEventListener("keydown", e => {
    if (e.key === "T" && e.shiftKey) {
      panel.classList.toggle("theme-panel-visible");
    }
  });

  closeBtn.addEventListener("click", () => {
    panel.classList.remove("theme-panel-visible");
  });

  // buttons
  const buttons = panel.querySelectorAll("[data-bg]");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.bg;
      const next = mode === "night" ? "dark" : "day";
      document.dispatchEvent(new CustomEvent("theme-changed", { detail: next }));
    });
  });
})();
