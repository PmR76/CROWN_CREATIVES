// ============================================================
// useThemeEngine.js — Crown Creatives Theme Engine Hook
// ============================================================

import { useEffect, useState } from "react";

export function useThemeEngine() {
  const [theme, setTheme] = useState("day");

  // Apply theme to body + dispatch theme-set
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);

    // Ensure no inline background override
    document.body.style.background = "";

    window.dispatchEvent(
      new CustomEvent("theme-set", { detail: theme })
    );
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "night" ? "day" : "night"));
  };

  const setThemeDirect = (nextTheme) => {
    setTheme(nextTheme);
  };

  return {
    theme,
    toggleTheme,
    setThemeDirect
  };
}
