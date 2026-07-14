// ============================================================
// HeroCrown.jsx — Cinematic Day/Night Crown (Global)
// ============================================================

import { useThemeEngine } from "../hooks/useThemeEngine";

export default function HeroCrown() {
  const { theme } = useThemeEngine();

  const isDay = theme === "day";
  const isNight = theme === "night";

  return (
    <div className="hero-crown-wrapper">
      <img
        src="/assets/icons/day-crown.svg"
        alt="Day Crown"
        className={`hero-crown-img ${isDay ? "active" : ""}`}
      />

      <img
        src="/assets/icons/night-crown.svg"
        alt="Night Crown"
        className={`hero-crown-img ${isNight ? "active" : ""}`}
      />
    </div>
  );
}
