// ============================================================
// useThemeEngine.js — Crown Creatives Theme Engine Hook
// ============================================================

import { useEffect } from "react";
import { scheduleMidnightRotation } from "../theme/theme-rotation.js";

export function useThemeEngine() {
  useEffect(() => {
    // ------------------------------------------------------------
    // INITIALIZE MIDNIGHT ROTATION
    // ------------------------------------------------------------
    scheduleMidnightRotation();

    // ------------------------------------------------------------
    // HANDLE THEME CHANGE EVENTS
    // ------------------------------------------------------------
    const handleThemeChange = (event) => {
      const { role, key } = event.detail;

      // Apply theme to DOM
      document.body.setAttribute("data-theme", role);
      document.body.setAttribute("data-theme-key", key);

      // Dispatch diagnostics snapshot
      window.dispatchEvent(
        new CustomEvent("theme-snapshot", {
          detail: {
            role,
            key,
            applied: true
          }
        })
      );
    };

    window.addEventListener("themeChange", handleThemeChange);

    return () => {
      window.removeEventListener("themeChange", handleThemeChange);
    };
  }, []);
}
