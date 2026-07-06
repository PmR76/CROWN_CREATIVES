class ThemeEngine {
  constructor() {
    this.currentRole = localStorage.getItem("cc-theme-role") || "day";
    this.currentKey = localStorage.getItem("cc-theme-key") || "sunrise";

    this.applyGradient(this.currentRole, this.currentKey);
    this.dispatchSnapshot();
  }

  dispatchSnapshot() {
    window.dispatchEvent(
      new CustomEvent("theme-snapshot", {
        detail: {
          role: this.currentRole,
          key: this.currentKey,
          applied: document.body.style.background,
          timestamp: Date.now()
        }
      })
    );
  }

  setBackgroundTheme(role, key) {
    this.currentRole = role;
    this.currentKey = key;

    localStorage.setItem("cc-theme-role", role);
    localStorage.setItem("cc-theme-key", key);

    this.applyGradient(role, key);

    window.dispatchEvent(
      new CustomEvent("theme-gradient-changed", {
        detail: { role, key }
      })
    );

    this.dispatchSnapshot();
  }

  applyGradient(role, key) {
    const varName = `--grad-${key}`;
    const gradient = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();

    if (!gradient) {
      console.warn(`Missing gradient variable: ${varName}`);
      return;
    }

    document.body.style.background = gradient;
    document.body.dataset.themeRole = role;
    document.body.dataset.themeKey = key;
  }
}

export const themeEngine = new ThemeEngine();
