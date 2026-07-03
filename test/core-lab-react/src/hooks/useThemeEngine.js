// ============================================================
// useThemeEngine — Crown Creatives Unified Theme Hook
// React + Global ThemeEngine + Crown Transition
// ============================================================

import { useEffect, useState, useCallback } from "react";

export default function useThemeEngine() {
  // Load saved theme or default to "day"
  const [theme, setTheme] = useState(
    localStorage.getItem("cc-theme") || "day"
  );

  // Apply theme to <body> + crown transition
  const applyTheme = useCallback(
    (nextTheme) => {
      setTheme(nextTheme);
      document.body.dataset.theme = nextTheme;
      localStorage.setItem("cc-theme", nextTheme);

      // Broadcast unified event
      window.dispatchEvent(
        new CustomEvent("theme-changed", { detail: nextTheme })
      );

      // Crown fade transition
      const dayCrown = document.getElementById("hero-crown-day");
      const nightCrown = document.getElementById("hero-crown-night");

      if (dayCrown && nightCrown) {
        if (nextTheme === "day") {
          dayCrown.classList.add("visible");
          nightCrown.classList.remove("visible");
        } else {
          dayCrown.classList.remove("visible");
          nightCrown.classList.add("visible");
        }
      }
    },
    []
  );

  // Reactively apply theme whenever state changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Listen for external theme-set events (lab, header, etc.)
  useEffect(() => {
    const handler = (e) => {
      const next = e.detail;
      applyTheme(next);
    };

    window.addEventListener("theme-set", handler);
    return () => window.removeEventListener("theme-set", handler);
  }, [applyTheme]);

  // Toggle theme (day ↔ night)
  const toggleTheme = useCallback(() => {
    const next = theme === "day" ? "night" : "day";
    applyTheme(next);
  }, [theme, applyTheme]);

  return {
    theme,
    setTheme: applyTheme,
    toggleTheme,
  };
}
