/* ============================================================
   CROWN CREATIVES — THEME ENGINE (MODE + EVENTS ONLY)
   - Day/Night switching
   - theme-changed events for crown + gallery
   - Leaves gradients + glow to theme-panel.js
============================================================ */

(function () {

  /* ------------------------------------------------------------
     1. THEME TOGGLE BUTTON (DAY/NIGHT)
  ------------------------------------------------------------ */
  const toggle = document.getElementById("themeToggle");

  function applyMode(mode) {
    if (mode === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    // Notify crown + gallery
    document.dispatchEvent(new CustomEvent("theme-changed", { detail: mode }));
  }

  /* ------------------------------------------------------------
     2. INITIALISE
  ------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    // Default to day
    applyMode("day");

    if (toggle) {
      toggle.addEventListener("click", () => {
        const next = document.body.classList.contains("dark-mode") ? "day" : "dark";
        applyMode(next);
      });
    }
  });

})();
