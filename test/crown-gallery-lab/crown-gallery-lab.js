/* ============================================================
   CROWN GALLERY LAB — THEME ENGINE BRIDGE
   Option C: Both crown and gallery listen to theme engine only
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  console.log("Crown Gallery Lab JS Loaded:", new Date().toLocaleString());

  const themeButtons = document.querySelectorAll("#lab-theme-toggle button");

  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    document.dispatchEvent(new CustomEvent("theme-changed", { detail: theme }));
  }

  // Initial theme
  const initialTheme = document.body.classList.contains("dark-mode") ? "dark" : "day";
  applyTheme(initialTheme);

  // Lab theme toggle
  themeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme === "dark" ? "dark" : "day";
      applyTheme(theme);
    });
  });

  console.info("Crown Gallery Lab theme bridge initialised.");
});
