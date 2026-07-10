// ============================================================
// useThemeEngine.js — Crown Creatives Theme Engine Hook
// ============================================================

import { useEffect, useState } from "react";
import { scheduleMidnightRotation } from "../theme/theme-rotation.js";

export function useThemeEngine() {
  // ------------------------------------------------------------
  // INTERNAL THEME STATE (day / night / admin / etc.)
  // ------------------------------------------------------------
  const [theme, setTheme] = useState("day");

  // ------------------------------------------------------------
  // APPLY THEME TO DOM + DISPATCH theme-set EVENT
  // ------------------------------------------------------------
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);

    window.dispatchEvent(
      new CustomEvent("theme-set", { detail: theme })
    );
  }, [theme]);

  // ------------------------------------------------------------
  // PUBLIC: TOGGLE BETWEEN DAY/NIGHT
  // ------------------------------------------------------------
  const toggleTheme = () => {
    setTheme((prev) => (prev === "night" ? "day" : "night"));
  };

  // ------------------------------------------------------------
  // PUBLIC: DIRECTLY SET A THEME (ADMIN SWATCHES)
  // ------------------------------------------------------------
  const setThemeDirect = (nextTheme) => {
    setTheme(nextTheme);
  };

  // ------------------------------------------------------------
  // INITIALIZE MIDNIGHT ROTATION + LISTEN FOR themeChange EVENTS
  // ------------------------------------------------------------
  useEffect(() => {
    scheduleMidnightRotation();

    const handleThemeChange = (event) => {
      const { role, key } = event.detail;

      // Apply theme role + key
      document.body.setAttribute("data-theme", role);
      document.body.setAttribute("data-theme-key", key);

      // Diagnostics snapshot
      window.dispatchEvent(
        new CustomEvent("theme-snapshot", {
          detail: { role, key, applied: true }
        })
      );
    };

    window.addEventListener("themeChange", handleThemeChange);

    return () => {
      window.removeEventListener("themeChange", handleThemeChange);
    };
  }, []);

  // ------------------------------------------------------------
  // EXPOSE PUBLIC API
  // ------------------------------------------------------------
  return {
    theme,
    toggleTheme,
    setThemeDirect
  };
}
