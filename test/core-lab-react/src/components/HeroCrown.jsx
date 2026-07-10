// ============================================================
// HeroCrown.jsx — Cinematic Crown Fade (Day/Night Reactive)
// ============================================================

import React, { useEffect, useState } from "react";
import "../styles/hero-crown.css";

export default function HeroCrown() {
  const [theme, setTheme] = useState(document.body.dataset.theme || "day");

  useEffect(() => {
    const handler = (e) => setTheme(e.detail);
    window.addEventListener("theme-set", handler);
    return () => window.removeEventListener("theme-set", handler);
  }, []);

  return (
    <div className="hero-crown-wrapper">
      <img
        src="/assets/icons/day-crown.svg"
        className={`hero-crown-img ${theme === "day" ? "active" : ""}`}
      />
      <img
        src="/assets/icons/night-crown.svg"
        className={`hero-crown-img ${theme === "night" ? "active" : ""}`}
      />
    </div>
  );
}
