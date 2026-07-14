// ============================================================
// useThemeEngine.js — Crown Creatives Unified Theme Engine (GR1)
// ============================================================

import { useEffect, useState } from "react";

export function useThemeEngine() {

  // ⭐ Internal React state (this was missing)
  const [theme, setTheme] = useState("day");

  // ------------------------------------------------------------
  // APPLY THEME — sets dataset.theme + correct background
  // ------------------------------------------------------------
  function applyTheme(nextTheme) {

    // Update React state
    setTheme(nextTheme);

    // Update dataset theme
    document.body.dataset.theme = nextTheme;

    // Load saved gradients
    const day = localStorage.getItem("theme-day");
    const night = localStorage.getItem("theme-night");

    // Apply correct background immediately
    document.body.style.background =
      nextTheme === "day" ? day : night;

    // Dispatch theme-set event (AdminPanel + Layout.jsx listen)
    window.dispatchEvent(
      new CustomEvent("theme-set", { detail: nextTheme })
    );
  }

  // ------------------------------------------------------------
  // TOGGLE THEME — day ↔ night
  // ------------------------------------------------------------
  function toggleTheme() {
    const current = document.body.dataset.theme || "day";
    const next = current === "day" ? "night" : "day";
    applyTheme(next);
  }

  // ------------------------------------------------------------
  // INITIALIZE — ensure dataset.theme exists + apply background
  // ------------------------------------------------------------
  useEffect(() => {
    const existing = document.body.dataset.theme;

    // Default to day if missing
    const initial = existing || "day";
    applyTheme(initial);
  }, []);

  // ------------------------------------------------------------
  // PUBLIC API — NOW RETURNS THEME (GR1 FIX)
  // ------------------------------------------------------------
  return {
    theme,              // ⭐ THIS FIXES HERO-CROWN
    toggleTheme,
    setThemeDirect: applyTheme
  };
}
