/* ============================================================
   HERO CROWN — FINAL THEME‑REACTIVE VERSION
============================================================ */

window.initHeroCrown = function () {

  const day = document.getElementById("hero-crown-day");
  const night = document.getElementById("hero-crown-night");

  if (!day || !night) {
    console.warn("Hero Crown: missing crown images in DOM.");
    return;
  }

  /* ------------------------------------------------------------
     Apply crown visibility + glow based on theme
  ------------------------------------------------------------ */
  function apply(theme) {

    if (theme === "dark") {
      day.style.opacity = "0";
      night.style.opacity = "1";

      // Night glow (neon / mystic)
      document.documentElement.style.setProperty(
        "--crown-glow-color",
        "rgba(120, 200, 255, 0.9)"
      );

    } else {
      day.style.opacity = "1";
      night.style.opacity = "0";

      // Day glow (warm gold)
      document.documentElement.style.setProperty(
        "--crown-glow-color",
        "rgba(255, 210, 150, 0.8)"
      );
    }
  }

  /* ------------------------------------------------------------
     Initial state — detect current theme
  ------------------------------------------------------------ */
  const initialTheme =
    document.body.classList.contains("dark-mode") ? "dark" : "day";

  apply(initialTheme);

  /* ------------------------------------------------------------
     Listen for theme changes from theme-engine.js
  ------------------------------------------------------------ */
  document.addEventListener("theme-changed", e => {
    const next = e.detail;
    apply(next);
  });

  console.info("Hero Crown initialised with theme-reactive glow.");
};

/* ------------------------------------------------------------
   Initialise on DOM ready
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", window.initHeroCrown);
