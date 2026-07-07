// ============================================================
// HeroCrown.jsx — Cinematic Crown (Isolated Theme Lab Version)
// Date: 2026-07-07 13:55 BST
// ============================================================

import { useEffect } from "react";

export default function HeroCrown() {
  useEffect(() => {
    const day = document.getElementById("hero-crown-day");
    const night = document.getElementById("hero-crown-night");

    if (!day || !night) return;

    const apply = (theme) => {
      if (theme === "dark") {
        day.style.opacity = "0";
        night.style.opacity = "1";
      } else {
        day.style.opacity = "1";
        night.style.opacity = "0";
      }
    };

    const initialTheme =
      document.body.dataset.theme === "dark" ? "dark" : "day";
    apply(initialTheme);

    window.addEventListener("theme-set", (e) => apply(e.detail));

    return () => {
      window.removeEventListener("theme-set", (e) => apply(e.detail));
    };
  }, []);

  return (
    <div id="hero-crown-container">
      <img
        id="hero-crown-day"
        className="hero-crown float"
        src="/assets/icons/day-crown.svg"
        alt="Day Crown"
      />

      <img
        id="hero-crown-night"
        className="hero-crown float"
        src="/assets/icons/night-crown.svg"
        alt="Night Crown"
      />
    </div>
  );
}
