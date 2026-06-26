/* ============================================================
   CROWN CREATIVES — THEME ENGINE (MODE + EVENTS ONLY)
============================================================ */

(function () {

  const toggle = document.getElementById("themeToggle");

  function applyMode(mode) {
    if (mode === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    localStorage.setItem("cc-mode", mode);

    document.dispatchEvent(new CustomEvent("theme-changed", { detail: mode }));
  }

  document.addEventListener("DOMContentLoaded", () => {

    const savedMode = localStorage.getItem("cc-mode") || "day";
    applyMode(savedMode);

    if (toggle) {
      toggle.addEventListener("click", () => {
        const next = document.body.classList.contains("dark-mode") ? "day" : "dark";
        applyMode(next);
      });
    }
  });

})();
