/* ============================================================
   CROWN CREATIVES — HERO CROWN V3 (FINAL)
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
  const day = document.getElementById("hero-crown-day");
  const night = document.getElementById("hero-crown-night");

  if (!day || !night) {
    console.warn("Hero Crown: crowns not found in DOM.");
    return;
  }

  /* ------------------------------
     2. Apply crown state
  ------------------------------ */
  function apply(theme) {
    if (theme === "dark") {
      day.style.opacity = "0";
      night.style.opacity = "1";
    } else {
      day.style.opacity = "1";
      night.style.opacity = "0";
    }
  }

  /* ------------------------------
     3. Initial state (based on body)
  ------------------------------ */
  const initialTheme =
    document.body.classList.contains("dark-mode") ? "dark" : "day";

  apply(initialTheme);

  /* ------------------------------
     4. Listen for theme changes
  ------------------------------ */
  document.addEventListener("theme-changed", e => {
    const next = e.detail;
    apply(next);
  });

  /* ------------------------------
     5. Safety: crowns never block UI
  ------------------------------ */
  day.style.pointerEvents = "none";
  night.style.pointerEvents = "none";

  console.info("Hero Crown V3 initialised.");
};
/* TEST STATE */
window.initHeroCrown = function () {
  const day = document.getElementById("hero-crown-day");
  const night = document.getElementById("hero-crown-night");

  if (!day || !night) {
    console.warn("Hero Crown: crowns not found in DOM.");
    return;
  }

  function apply(theme) {
    if (theme === "dark") {
      day.style.opacity = "0";
      night.style.opacity = "1";
    } else {
      day.style.opacity = "1";
      night.style.opacity = "0";
    }
  }

  apply("day");

  document.addEventListener("theme-changed", e => apply(e.detail));

  day.style.pointerEvents = "none";
  night.style.pointerEvents = "none";

  console.info("Hero Crown Lab initialised.");
};

document.addEventListener("DOMContentLoaded", window.initHeroCrown);
