(function () {
  const panel = document.getElementById("theme-panel");
  const closeBtn = document.getElementById("theme-panel-close");

  // SHIFT + T toggles panel
  window.addEventListener("keydown", e => {
    if (e.key === "T" && e.shiftKey) {
      panel.classList.toggle("theme-panel-visible");
    }
  });

  closeBtn.addEventListener("click", () => {
    panel.classList.remove("theme-panel-visible");
  });

  // Day/Night buttons
  const buttons = panel.querySelectorAll("[data-bg]");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.bg === "night" ? "dark" : "day";
      document.dispatchEvent(new CustomEvent("theme-changed", { detail: mode }));
    });
  });
})();
