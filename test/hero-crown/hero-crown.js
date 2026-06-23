/* ============================================================
   CROWN CREATIVES — HERO CROWN V2
   Responsibilities:
   - Sync crown visibility with theme engine
   - Trigger CSS-driven 8s fade transitions
   - Ensure correct crown on initial load
   - No shimmer leaks, no ghost images
============================================================ */

window.initHeroCrown = function () {

  /* ------------------------------
     1. Locate the crowns
  ------------------------------ */
  const dayCrown  = document.getElementById("hero-crown-day");
  const nightCrown = document.getElementById("hero-crown-night");

  if (!dayCrown || !nightCrown) {
    console.warn("Hero Crown: crowns not found in DOM.");
    return;
  }

  /* ------------------------------
     2. Apply correct crown on load
     (based on saved theme)
  ------------------------------ */
  function applyInitialState() {
    const theme = document.body.getAttribute("data-theme") || "dark";

    if (theme === "dark") {
      dayCrown.style.opacity = "0";
      nightCrown.style.opacity = "1";
    } else {
      dayCrown.style.opacity = "1";
      nightCrown.style.opacity = "0";
    }
  }

  applyInitialState();

  /* ------------------------------
     3. Listen for theme changes
     (from theme.js)
  ------------------------------ */
  document.addEventListener("theme-changed", e => {
    const next = e.detail;

    // CSS handles the 8s fade — we only set target states
    if (next === "dark") {
      dayCrown.style.opacity = "0";
      nightCrown.style.opacity = "1";
    } else {
      dayCrown.style.opacity = "1";
      nightCrown.style.opacity = "0";
    }
  });

  /* ------------------------------
     4. Safety: ensure crowns never
        interfere with pointer events
  ------------------------------ */
  dayCrown.style.pointerEvents = "none";
  nightCrown.style.pointerEvents = "none";

  console.info("Hero Crown V2 initialised.");
};
window.initHeroCrown = function () {
  const day = document.getElementById("hero-crown-day");
  const night = document.getElementById("hero-crown-night");

  if (!day || !night) {
    console.warn("Hero Crown missing in DOM.");
    return;
  }

  function apply(theme) {
    if (theme === "dark") {
      day.style.opacity = 0;
      night.style.opacity = 1;
    } else {
      day.style.opacity = 1;
      night.style.opacity = 0;
    }
  }

  const initial = document.body.classList.contains("dark-mode") ? "dark" : "day";
  apply(initial);

  document.addEventListener("theme-changed", e => apply(e.detail));
};
