// ============================================================
// HeroCrown.jsx — Cinematic Crown (Theme Test Lab Version)
// ============================================================

import { useEffect } from "react";

export default function HeroCrown() {
  useEffect(() => {
    const day = document.getElementById("hero-crown-day");
    const night = document.getElementById("hero-crown-night");

    if (!day || !night) return;

    const apply = (theme) => {
      if (theme === "night") {
        day.classList.remove("active");
        night.classList.add("active");
      } else {
        night.classList.remove("active");
        day.classList.add("active");
      }
    };

    const initialTheme = document.body.dataset.theme || "day";
    apply(initialTheme);

    const handler = (e) => apply(e.detail);
    window.addEventListener("theme-set", handler);

    return () => window.removeEventListener("theme-set", handler);
  }, []);

  return (
    <div id="hero-crown-container">
      <img
        id="hero-crown-day"
        className="hero-crown active"
        src="/assets/icons/day-crown.svg"
        alt="Day Crown"
      />

      <img
        id="hero-crown-night"
        className="hero-crown"
        src="/assets/icons/night-crown.svg"
        alt="Night Crown"
      />
    </div>
  );
}
