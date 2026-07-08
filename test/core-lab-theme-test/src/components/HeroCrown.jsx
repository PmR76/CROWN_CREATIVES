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

        day.classList.remove("day");
        night.classList.add("night");
      } else {
        day.style.opacity = "1";
        night.style.opacity = "0";

        night.classList.remove("night");
        day.classList.add("day");
      }
    };

    const initialTheme =
      document.body.dataset.theme === "dark" ? "dark" : "day";
    apply(initialTheme);

    const handler = (e) => apply(e.detail);
    window.addEventListener("theme-set", handler);

    return () => {
      window.removeEventListener("theme-set", handler);
    };
  }, []);

  return (
    <div id="hero-crown-container">
      <img
        id="hero-crown-day"
        className="hero-crown float day"
        src="/assets/icons/day-crown.svg"
        alt="Day Crown"
      />

      <img
        id="hero-crown-night"
        className="hero-crown float night"
        src="/assets/icons/night-crown.png"
        alt="Night Crown"
      />
    </div>
  );
}
