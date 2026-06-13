/* ============================================================
   CROWN CREATIVES — GLOBAL THEME ENGINE v5.0
   Day/Night mode, icon animation, persistence, safe loading
============================================================ */

window.initThemeEngine = function () {

  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");

  if (!themeToggle) {
    console.warn("Theme toggle not found.");
    return;
  }

  /* ------------------------------------------------------------
     1. LOAD SAVED THEME
  ------------------------------------------------------------ */
  const saved = localStorage.getItem("cc-theme");

  if (saved === "light") {
    applyLightMode(false);
  } else if (saved === "dark") {
    applyDarkMode(false);
  } else {
    // Default = dark mode
    applyDarkMode(false);
  }

  /* ------------------------------------------------------------
     2. CLICK HANDLER
  ------------------------------------------------------------ */
  themeToggle.addEventListener("click", () => {
    const isDark = body.classList.contains("dark-mode");

    if (isDark) {
      applyLightMode(true);
    } else {
      applyDarkMode(true);
    }

    // Bounce animation
    themeToggle.style.transform = "scale(1.25)";
    setTimeout(() => {
      themeToggle.style.transform = "scale(1)";
    }, 150);
  });

  /* ------------------------------------------------------------
     3. APPLY LIGHT MODE
  ------------------------------------------------------------ */
  function applyLightMode(animate = true) {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");

    localStorage.setItem("cc-theme", "light");

    updateThemeIcon("light");

    if (animate) smoothThemeTransition();
  }

  /* ------------------------------------------------------------
     4. APPLY DARK MODE
  ------------------------------------------------------------ */
  function applyDarkMode(animate = true) {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");

    localStorage.setItem("cc-theme", "dark");

    updateThemeIcon("dark");

    if (animate) smoothThemeTransition();
  }

  /* ------------------------------------------------------------
     5. UPDATE ICON (optional future expansion)
  ------------------------------------------------------------ */
  function updateThemeIcon(mode) {
    const icon = themeToggle.querySelector("img");
    if (!icon) return;

    icon.src = mode === "dark"
      ? "/assets/icons/sun-moon.png"
      : "/assets/icons/sun-moon.png"; // same icon, but you can swap if you want
  }

  /* ------------------------------------------------------------
     6. SMOOTH TRANSITION
  ------------------------------------------------------------ */
  function smoothThemeTransition() {
    body.style.transition = "background 0.6s ease, color 0.6s ease, filter 0.6s ease";

    setTimeout(() => {
      body.style.transition = "";
    }, 700);
  }

};
