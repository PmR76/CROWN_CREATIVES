// ============================================================
// themeEngine.js — Central Day/Night Theme Controller (GR1)
// ============================================================

const THEME_KEY = "theme-current";
const THEME_DAY_BG_KEY = "theme-day";
const THEME_NIGHT_BG_KEY = "theme-night";

// ------------------------------------------------------------
// INITIALISE THEME ON PAGE LOAD
// ------------------------------------------------------------
export function initThemeEngine() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    const initial = stored === "night" ? "night" : "day";
    applyTheme(initial, false);
  } catch {
    applyTheme("day", false);
  }
}

// ------------------------------------------------------------
// TOGGLE THEME (DAY ↔ NIGHT)
// ------------------------------------------------------------
export function toggleTheme() {
  const current =
    document.body.dataset.theme ||
    document.documentElement.dataset.theme ||
    "day";

  const next = current === "day" ? "night" : "day";
  applyTheme(next, true);
}

// ------------------------------------------------------------
// SET THEME DIRECTLY (USED BY ThemePanel)
// ------------------------------------------------------------
export function setThemeDirect(theme) {
  applyTheme(theme, true);
}

// ------------------------------------------------------------
// INTERNAL APPLY FUNCTION
// ------------------------------------------------------------
function applyTheme(theme, dispatch = true) {
  if (!theme) theme = "day";

  // ⭐ CRITICAL FIX — apply theme to BOTH body and html
  document.body.dataset.theme = theme;
  document.documentElement.dataset.theme = theme;

  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}

  const dayBg = localStorage.getItem(THEME_DAY_BG_KEY);
  const nightBg = localStorage.getItem(THEME_NIGHT_BG_KEY);

  if (theme === "day") {
    document.body.style.background = dayBg || "";
  } else {
    document.body.style.background = nightBg || "";
  }

  if (dispatch) {
    try {
      window.dispatchEvent(
        new CustomEvent("theme-set", {
          detail: theme,
        })
      );
    } catch {}
  }
}
