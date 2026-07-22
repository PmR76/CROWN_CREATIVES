// ============================================================
// HeroCrown.jsx — Cinematic Day/Night Crown (GR1 Stable)
// ============================================================

import { useThemeEngine } from "../hooks/useThemeEngine.js";

export default function HeroCrown() {
  const themeState = useThemeEngine() || {};
  const theme = themeState.theme || "day";

  const isDay = theme === "day";
  const isNight = theme === "night";

  return (
    <div className="hero-crown-wrapper">
      {/* DAY CROWN */}
      <img
        src="/assets/icons/day-crown.svg"
        alt="Day Crown"
        className={`hero-crown-img ${isDay ? "active" : ""}`}
      />

      {/* NIGHT CROWN */}
      <img
        src="/assets/icons/night-crown.svg"
        alt="Night Crown"
        className={`hero-crown-img ${isNight ? "active" : ""}`}
      />
    </div>
  );
}
