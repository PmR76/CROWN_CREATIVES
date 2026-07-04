// ============================================================
// ThemeEngine — Crown Creatives Unified Day/Night Engine
// Controls background theme + crown fade + global theme state
// ============================================================

class ThemeEngine {
  constructor() {
    this.root = document.body;

    // Load saved theme or default to "day"
    this.current = localStorage.getItem("cc-theme") || "day";

    // Apply immediately
    this.apply(this.current);
  }

  apply(theme) {
    this.current = theme;

    // Set <body data-theme="">
    this.root.dataset.theme = theme;

    // Persist
    localStorage.setItem("cc-theme", theme);

    // Broadcast unified event
    window.dispatchEvent(
      new CustomEvent("theme-changed", { detail: theme })
    );

    // Crown transition
    const dayCrown = document.getElementById("hero-crown-day");
    const nightCrown = document.getElementById("hero-crown-night");

    if (dayCrown && nightCrown) {
      if (theme === "day") {
        dayCrown.classList.add("visible");
        nightCrown.classList.remove("visible");
      } else {
        dayCrown.classList.remove("visible");
        nightCrown.classList.add("visible");
      }
    }
  }

  toggle() {
    const next = this.current === "day" ? "night" : "day";
    this.apply(next);
  }
}

export const themeEngine = new ThemeEngine();
export default themeEngine;
