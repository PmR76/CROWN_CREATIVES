// ============================================================
// useThemeEngine.js — Theme Hook for Components (GR1)
// ============================================================

import { useEffect, useState } from "react";
import { initThemeEngine, setThemeDirect as setThemeDirectEngine } from "../theme/themeEngine.js";

export function useThemeEngine() {
  const [theme, setTheme] = useState(
    document.body.dataset.theme || "day"
  );

  useEffect(() => {
    // Ensure initial theme is applied once
    initThemeEngine();

    const handler = (e) => {
      setTheme(e.detail);
    };

    window.addEventListener("theme-set", handler);

    return () => {
      window.removeEventListener("theme-set", handler);
    };
  }, []);

  const setThemeDirect = (next) => {
    setThemeDirectEngine(next);
  };

  return { theme, setThemeDirect };
}
