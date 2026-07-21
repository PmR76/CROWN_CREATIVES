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
    // Prevent crash if localStorage is blocked
    applyTheme("day", false);
  }
}

// ------------------------------------------------------------
// TOGGLE THEME (DAY ↔ NIGHT)
// ------------------------------------------------------------
export function toggleTheme() {
  const current = document.body.dataset.theme || "day";
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
  // Prevent undefined theme crash
  if (!theme) theme = "day";

  document.body.dataset.theme = theme;

  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Ignore storage errors (private mode, blocked storage)
  }

  const dayBg = localStorage.getItem(THEME_DAY_BG_KEY);
  const nightBg = localStorage.getItem(THEME_NIGHT_BG_KEY);

  if (theme === "day") {
    if (dayBg) document.body.style.background = dayBg;
    else document.body.style.background = "";
  } else {
    if (nightBg) document.body.style.background = nightBg;
    else document.body.style.background = "";
  }

  if (dispatch) {
    try {
      window.dispatchEvent(
        new CustomEvent("theme-set", {
          detail: theme,
        })
      );
    } catch {
      // Prevent crash if CustomEvent fails
    }
  }
}
