// ============================================================
// ThemeEngine — Crown Creatives
// Controls day/night theme + crown transition
// ============================================================

export default class ThemeEngine {
  constructor() {
    this.root = document.body;
    this.current = localStorage.getItem("cc-theme") || "day";
    this.apply(this.current);
  }

  apply(theme) {
    this.current = theme;
    this.root.setAttribute("data-theme", theme);
    localStorage.setItem("cc-theme", theme);

    // Trigger crown transition
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
