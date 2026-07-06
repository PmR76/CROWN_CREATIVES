class ThemeEngine {
  constructor() {
    this.currentTheme = localStorage.getItem("cc-theme") || "day";
    this.currentGradient = localStorage.getItem("cc-gradient") || "sunrise";

    this.applyGradient(this.currentGradient);
    document.body.dataset.theme = this.currentTheme;

    this.dispatchSnapshot();
  }

  dispatchSnapshot() {
    window.dispatchEvent(
      new CustomEvent("theme-snapshot", {
        detail: {
          theme: this.currentTheme,
          gradient: this.currentGradient,
          applied: document.body.style.background,
          timestamp: Date.now()
        }
      })
    );
  }

  setBackgroundTheme(theme, gradient) {
    this.currentTheme = theme;
    this.currentGradient = gradient;

    localStorage.setItem("cc-theme", theme);
    localStorage.setItem("cc-gradient", gradient);

    document.body.dataset.theme = theme;
    this.applyGradient(gradient);

    window.dispatchEvent(
      new CustomEvent("theme-set", { detail: theme })
    );

    this.dispatchSnapshot();
  }

  applyGradient(key) {
    const varName = `--grad-${key}`;
    const gradient = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();

    if (!gradient) {
      console.warn(`Missing gradient variable: ${varName}`);
      return;
    }

    document.body.style.background = gradient;
  }
}

export const themeEngine = new ThemeEngine();
