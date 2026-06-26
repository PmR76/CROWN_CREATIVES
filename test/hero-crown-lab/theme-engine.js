/* ============================================================
   CROWN CREATIVES — THEME ENGINE (EXPANDED)
   Handles:
   - Day/Night switching
   - Theme panel swatches
   - Glow variable updates
   - Crown + Gallery integration
============================================================ */

(function () {

  /* ------------------------------------------------------------
     1. MASTER GRADIENT MAP
     Maps swatch keys → CSS variables
  ------------------------------------------------------------ */
  const gradients = {

    /* DAY (ORIGINAL) */
    "sunrise": "var(--grad-sunrise)",
    "warm-daylight": "var(--grad-warm-daylight)",
    "soft-sky": "var(--grad-soft-sky)",
    "sunset-glow": "var(--grad-sunset-glow)",

    /* NEW DAY (ORIGINAL) */
    "ocean-mist": "var(--grad-ocean-mist)",
    "royal-ember": "var(--grad-royal-ember)",
    "solar-bloom": "var(--grad-solar-bloom)",
    "crown-platinum": "var(--grad-crown-platinum)",

    /* DAY EXPANSION */
    "sunrise-blush": "var(--grad-sunrise-blush)",
    "peach-horizon": "var(--grad-peach-horizon)",
    "coral-bloom": "var(--grad-coral-bloom)",
    "apricot-sky": "var(--grad-apricot-sky)",
    "golden-hour": "var(--grad-golden-hour)",
    "sherbet-glow": "var(--grad-sherbet-glow)",
    "ember-mist": "var(--grad-ember-mist)",
    "radiant-dawn": "var(--grad-radiant-dawn)",

    /* NIGHT (ORIGINAL) */
    "midnight-indigo": "var(--grad-midnight-indigo)",
    "royal-night": "var(--grad-royal-night)",
    "aurora": "var(--grad-aurora)",
    "deep-space": "var(--grad-deep-space)",

    /* NEW NIGHT (ORIGINAL) */
    "deep-velvet": "var(--grad-deep-velvet)",
    "cosmic-royal": "var(--grad-cosmic-royal)",
    "nebula-drift": "var(--grad-nebula-drift)",
    "crown-nocturne": "var(--grad-crown-nocturne)",

    /* NIGHT EXPANSION */
    "nebula-violet": "var(--grad-nebula-violet)",
    "midnight-royal": "var(--grad-midnight-royal)",
    "cosmic-indigo": "var(--grad-cosmic-indigo)",
    "ultraviolet-drift": "var(--grad-ultraviolet-drift)",
    "deep-abyss": "var(--grad-deep-abyss)",
    "lunar-ice": "var(--grad-lunar-ice)",
    "starlight-veil": "var(--grad-starlight-veil)",
    "aurora-veil": "var(--grad-aurora-veil)",

    /* SPECIAL (ORIGINAL) */
    "neon": "var(--grad-neon)",
    "galaxy": "var(--grad-galaxy)",
    "crown-gold": "var(--grad-crown-gold)",
    "royal-blue": "var(--grad-royal-blue)",

    /* SPECIAL EXPANSION */
    "neon-magenta": "var(--grad-neon-magenta)",
    "electric-crown": "var(--grad-electric-crown)",
    "royal-spectrum": "var(--grad-royal-spectrum)",
    "hypernova": "var(--grad-hypernova)",
    "neon-ocean": "var(--grad-neon-ocean)",
    "prism-burst": "var(--grad-prism-burst)",
    "crown-flare": "var(--grad-crown-flare)",
    "galaxy-rift": "var(--grad-galaxy-rift)"
  };

  /* ------------------------------------------------------------
     2. GLOW MAP
     Matches theme → glow variable
  ------------------------------------------------------------ */
  const glowVars = {};
  Object.keys(gradients).forEach(key => {
    glowVars[key] = `var(--glow-${key})`;
  });

  /* ------------------------------------------------------------
     3. APPLY THEME
     Updates:
     - Body background
     - Glow overlays
     - Crown engine
     - Gallery engine
  ------------------------------------------------------------ */
  function applyTheme(key) {
    const gradient = gradients[key];
    const glow = glowVars[key];

    if (!gradient) return;

    // Update background
    document.documentElement.style.setProperty("--active-day-gradient", gradient);
    document.documentElement.style.setProperty("--active-night-gradient", gradient);

    // Update glow overlays
    document.documentElement.style.setProperty("--active-glow", glow);

    // Notify other modules
    document.dispatchEvent(new CustomEvent("theme-changed", { detail: key }));
  }

  /* ------------------------------------------------------------
     4. SWATCH CLICK HANDLERS
  ------------------------------------------------------------ */
  function initSwatches() {
    const swatches = document.querySelectorAll(".theme-swatch");

    swatches.forEach(swatch => {
      swatch.addEventListener("click", () => {
        const key = swatch.dataset.key;
        applyTheme(key);
      });
    });
  }

  /* ------------------------------------------------------------
     5. THEME TOGGLE BUTTON (DAY/NIGHT)
  ------------------------------------------------------------ */
  const toggle = document.getElementById("themeToggle");

  function applyMode(mode) {
    if (mode === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    document.dispatchEvent(new CustomEvent("theme-changed", { detail: mode }));
  }

  if (toggle) {
    toggle.addEventListener("click", () => {
      const next = document.body.classList.contains("dark-mode") ? "day" : "dark";
      applyMode(next);
    });
  }

  /* ------------------------------------------------------------
     6. INITIALISE
  ------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    initSwatches();
    applyMode("day"); // default
  });

})();
