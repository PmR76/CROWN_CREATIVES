// ============================================================
// HeroCrown.jsx — Cinematic Day/Night Crown (Global)
// ============================================================

import { useThemeEngine } from "../hooks/useThemeEngine";

export default function HeroCrown() {

  const { theme } = useThemeEngine();   // "day" or "night"

  return (
    <div className="hero-crown-wrapper">

      {/* ⭐ DAY CROWN */}
      <img
        src="/assets/icons/day-crown.svg"
        alt="Day Crown"
        className={`hero-crown-img ${theme === "day" ? "active" : ""}`}
      />

      {/* ⭐ NIGHT CROWN */}
      <img
        src="/assets/icons/night-crown.svg"
        alt="Night Crown"
        className={`hero-crown-img ${theme === "night" ? "active" : ""}`}
      />

    </div>
  );
}
