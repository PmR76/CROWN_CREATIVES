// ============================================================
// useThemeEngine.js — Crown Creatives Theme Engine Hook
// ============================================================

import { useEffect, useState } from "react";
import { scheduleMidnightRotation } from "../theme/theme-rotation.js";

export function useThemeEngine() {
  // INTERNAL STATE
  const [theme, setTheme] = useState("day");

  // APPLY THEME TO DOM + DISPATCH theme-set EVENT
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);

    window.dispatchEvent(
      new CustomEvent("theme-set", { detail: theme })
    );
  }, [theme]);

  // PUBLIC: TOGGLE BETWEEN DAY/NIGHT
  const toggleTheme = () => {
    setTheme((prev) => (prev === "night" ? "day" : "night"));
  };

  // PUBLIC: DIRECTLY SET A THEME (ADMIN SWATCHES)
  const setThemeDirect = (nextTheme) => {
    setTheme(nextTheme);
  };

  // REMOVE BROKEN themeChange LISTENER
  // REMOVE role/key system
  // REMOVE data-theme-key
  // REMOVE conflicting theme system

  useEffect(() => {
    scheduleMidnightRotation();
  }, []);

  // EXPOSE PUBLIC API
  return {
    theme,
    toggleTheme,
    setThemeDirect
  };
}
