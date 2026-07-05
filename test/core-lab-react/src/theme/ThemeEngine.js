// ============================================================
// ThemeEngine — Gradient + Background Engine
// ============================================================

class ThemeEngine {
  constructor() {
    this.currentRole = "day";
    this.currentKey = localStorage.getItem("cc-theme-key") || "sunrise";

    // Apply immediately on load
    this.applyGradient(this.currentRole, this.currentKey);

    // Initial snapshot
    this.dispatchSnapshot();
  }

  // ------------------------------------------------------------
  // Dispatch Theme Snapshot (Diagnostics + DevTools)
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // Set Background Theme (Day/Night + Gradient Key)
  // ------------------------------------------------------------
  setBackgroundTheme(role, key) {
    this.currentRole = role;
    this.currentKey = key;

    localStorage.setItem("cc-theme-role", role);
    localStorage.setItem("cc-theme-key", key);

    this.applyGradient(role, key);

    // Notify listeners
    window.dispatchEvent(
      new CustomEvent("theme-gradient-changed", {
        detail: { role, key }
      })
    );

    // Snapshot for diagnostics
    this.dispatchSnapshot();
  }

  // ------------------------------------------------------------
  // Apply Gradient to Document
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // Restore Last Saved Theme
  // ------------------------------------------------------------
  restore() {
    const role = localStorage.getItem("cc-theme-role") || "day";
    const key = localStorage.getItem("cc-theme-key") || "sunrise";
    this.setBackgroundTheme(role, key);
  }
}

export const themeEngine = new ThemeEngine();
