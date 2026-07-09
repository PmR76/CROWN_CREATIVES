// ============================================================
// useThemeEngine.js — Crown Creatives Theme Engine Hook
// ============================================================

import { useEffect } from "react";
import { scheduleMidnightRotation } from "../theme-rotation"; // ✅ corrected path

export function useThemeEngine() {
  useEffect(() => {
    // Initialize theme rotation once
    scheduleMidnightRotation();

    // Listen for theme changes
    const handleThemeChange = (event) => {
      document.body.setAttribute("data-theme", event.detail.theme);
    };

    window.addEventListener("themeChange", handleThemeChange);

    return () => {
      window.removeEventListener("themeChange", handleThemeChange);
    };
  }, []);
}
