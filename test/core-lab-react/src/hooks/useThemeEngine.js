// ============================================================
// useThemeEngine.js — Crown Creatives Theme Engine Hook
// ============================================================

import { useEffect, useState } from "react";
import { scheduleMidnightRotation } from "../theme/theme-rotation.js";

export function useThemeEngine() {
  const [theme, setTheme] = useState("day");

  // Apply theme + dispatch theme-set
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);

    // Remove any inline background override
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

  useEffect(() => {
    scheduleMidnightRotation();
  }, []);

  return {
    theme,
    toggleTheme,
    setThemeDirect
  };
}
