// ============================================================
// useThemeEngine.js — Theme Hook for Components (GR1 Stable)
// ============================================================

import { useEffect, useState } from "react";
import {
  initThemeEngine,
  setThemeDirect as setThemeDirectEngine
} from "../theme/themeEngine.js";

export function useThemeEngine() {
  // ------------------------------------------------------------
  // SAFE INITIAL STATE
  // ------------------------------------------------------------
  const safeInitialTheme =
    document.body?.dataset?.theme === "night" ? "night" : "day";

  const [theme, setTheme] = useState(safeInitialTheme);

  // ------------------------------------------------------------
  // INITIALISE + SUBSCRIBE TO THEME EVENTS
  // ------------------------------------------------------------
  useEffect(() => {
    try {
      initThemeEngine();
    } catch (err) {
      console.warn("ThemeEngine init failed:", err);
    }

    const handler = (e) => {
      try {
        setTheme(e.detail || "day");
      } catch {
        // Prevent React crash if event detail is malformed
      }
    };

    window.addEventListener("theme-set", handler);

    return () => {
      window.removeEventListener("theme-set", handler);
    };
  }, []);

  // ------------------------------------------------------------
  // DIRECT SETTER (ADMIN PANEL)
  // ------------------------------------------------------------
  const setThemeDirect = (next) => {
    try {
      setThemeDirectEngine(next);
    } catch (err) {
      console.warn("setThemeDirect failed:", err);
    }
  };

  return { theme, setThemeDirect };
}
