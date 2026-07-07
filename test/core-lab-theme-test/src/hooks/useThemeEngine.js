// ============================================================
// Theme Engine — Multi‑Page Persistent Background System
// ============================================================

import { useEffect } from "react";

export default function useThemeEngine() {
  useEffect(() => {
    const current = document.body.dataset.theme || "day";
    document.body.dataset.theme = current;

    const day = localStorage.getItem("theme-day");
    const night = localStorage.getItem("theme-dark");

    if (current === "day" && day) {
      document.body.style.background = day;
    }

    if (current === "dark" && night) {
      document.body.style.background = night;
    }

    // React to theme changes
    window.addEventListener("theme-set", (e) => {
      const mode = e.detail;

      if (mode === "day" && day) {
        document.body.style.background = day;
      }

      if (mode === "dark" && night) {
        document.body.style.background = night;
      }
    });
  }, []);
}
