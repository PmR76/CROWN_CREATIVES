// ============================================================
// useThemeEngine — React Hook Unified with ThemeEngine
// ============================================================

import { useEffect, useState, useCallback } from "react";

export default function useThemeEngine() {
  const [theme, setTheme] = useState(
    localStorage.getItem("cc-theme") || "day"
  );

  const applyTheme = useCallback((nextTheme) => {
    setTheme(nextTheme);
    document.body.dataset.theme = nextTheme;
    localStorage.setItem("cc-theme", nextTheme);

    window.dispatchEvent(
      new CustomEvent("theme-changed", { detail: nextTheme })
    );
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  useEffect(() => {
    const handler = (e) => applyTheme(e.detail);
    window.addEventListener("theme-set", handler);
    return () => window.removeEventListener("theme-set", handler);
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    const next = theme === "day" ? "night" : "day";
    applyTheme(next);
  }, [theme, applyTheme]);

  return { theme, toggleTheme };
}
