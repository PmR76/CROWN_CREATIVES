// ============================================================
// useThemeEngine.js — Final Theme Engine (No Sound Conflicts)
// ============================================================

import { useEffect } from "react";
import { scheduleMidnightRotation } from "../scripts/theme-rotation";

export function useThemeEngine() {
  useEffect(() => {
    // Ensure theme dataset exists
    if (!document.body.dataset.theme) {
      document.body.dataset.theme = "day";
    }

    // Load stored gradients
    const day = localStorage.getItem("theme-day");
    const night = localStorage.getItem("theme-night");

    if (day) document.body.style.setProperty("--day-bg", day);
    if (night) document.body.style.setProperty("--night-bg", night);

    const current = document.body.dataset.theme;

    if (current === "day" && day) {
      document.body.style.background = day;
    }
    if (current === "night" && night) {
      document.body.style.background = night;
    }

    // Midnight rotation
    scheduleMidnightRotation();
  }, []);
}
