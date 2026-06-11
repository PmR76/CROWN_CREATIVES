// ============================================================
// CROWN CREATIVES — GLOBAL THEME ENGINE
// Handles dark/light mode, icon animation, and persistence.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");

  // --------------------------------------------
  // 1. LOAD SAVED THEME FROM LOCAL STORAGE
  // --------------------------------------------
  const savedTheme = localStorage.getItem("cc-theme");

  if (savedTheme === "light") {
    body.classList.add("light-mode");
    body.classList.remove("dark-mode");
  } else {
    body.classList.add("dark-mode");
    body.classList.remove("light-mode");
  }

  // --------------------------------------------
  // 2. THEME TOGGLE CLICK HANDLER
  // --------------------------------------------
  themeToggle.addEventListener("click", () => {

    const isDark = body.classList.contains("dark-mode");

    if (isDark) {
      body.classList.remove("dark-mode");
      body.classList.add("light-mode");
      localStorage.setItem("cc-theme", "light");
    } else {
      body.classList.remove("light-mode");
      body.classList.add("dark-mode");
      localStorage.setItem("cc-theme", "dark");
    }

    // Quick bounce animation
    themeToggle.style.transform = "scale(1.3)";
    setTimeout(() => {
      themeToggle.style.transform = "scale(1)";
    }, 150);
  });

});
