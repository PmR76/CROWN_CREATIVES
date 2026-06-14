/* ============================================================
   HERO CROWN MODULE — LOGIC BRAIN
   Handles: day/night swap, future parallax, future breathing
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  
  const dayCrown = document.querySelector(".crown-day");
  const nightCrown = document.querySelector(".crown-night");

  if (!dayCrown || !nightCrown) return;

  // Ensure both crowns start perfectly aligned
  dayCrown.style.transform = "translateX(-50%)";
  nightCrown.style.transform = "translateX(-50%)";

  // Sync with dark mode state on load
  const isDark = document.body.classList.contains("dark-mode");

  if (isDark) {
    dayCrown.style.opacity = "0";
    nightCrown.style.opacity = "1";
  } else {
    dayCrown.style.opacity = "1";
    nightCrown.style.opacity = "0";
  }

  // Listen for theme changes (master.js toggles dark-mode class)
  const observer = new MutationObserver(() => {
    const dark = document.body.classList.contains("dark-mode");

    if (dark) {
      dayCrown.style.opacity = "0";
      nightCrown.style.opacity = "1";
    } else {
      dayCrown.style.opacity = "1";
      nightCrown.style.opacity = "0";
    }
  });

  observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
});
