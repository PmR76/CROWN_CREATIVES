// ============================================================
// Layout.jsx — Global Wrapper + Day/Night Theme Loader
// ============================================================

import React, { useEffect } from "react";
import Header from "./Header";
import DiagnosticsPanel from "./DiagnosticsPanel";
import AdminGate from "../admin/AdminGate";
import gradients from "../theme/theme-rotation"; // ⭐ REQUIRED for fallback values

export default function Layout({ children }) {

  // ------------------------------------------------------------
  // ⭐ Bullet‑proof theme loader — prevents white reset forever
  // ------------------------------------------------------------
  useEffect(() => {
    // 1. Load saved values
    let day = localStorage.getItem("theme-day");
    let night = localStorage.getItem("theme-night");

    // 2. Bullet‑proof fallback (never allow null)
    if (!day) {
      day = gradients.find(g => g.id === "day-1").preview;
      localStorage.setItem("theme-day", day);
    }

    if (!night) {
      night = gradients.find(g => g.id === "night-1").preview;
      localStorage.setItem("theme-night", night);
    }

    // ⭐ 3. Restore locked swatch IDs (day + night)
    const savedDayId = localStorage.getItem("theme-day-id");
    const savedNightId = localStorage.getItem("theme-night-id");

    if (savedDayId) {
      document.body.dataset.dayLock = savedDayId;
    }

    if (savedNightId) {
      document.body.dataset.nightLock = savedNightId;
    }

    // 4. Apply CSS variables (never empty)
    document.body.style.setProperty("--day-bg", day);
    document.body.style.setProperty("--night-bg", night);

    // 5. Apply correct background BEFORE render
    const current = document.body.dataset.theme || "day";

    if (current === "day") {
      document.body.style.background = day;
    } else {
      document.body.style.background = night;
    }
  }, []);

  return (
    <div className="core-layout">
      <Header />

      {/* ⭐ AdminGate listens for Shift + A */}
      <AdminGate />

      {children}

      <DiagnosticsPanel />
    </div>
  );
}
