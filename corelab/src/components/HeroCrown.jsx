import { useEffect, useState } from "react";
import { initThemeEngine, getTheme } from "../theme/themeEngine.js";

export default function HeroCrown() {
  const [theme, setTheme] = useState("day");

  useEffect(() => {
    initThemeEngine();
    setTheme(getTheme());
  }, []);

  return (
    <div className="hero-crown-wrapper">
      <img
        id="hero-crown-day"
        className={`hero-crown-img float ${theme === "day" ? "active" : ""}`}
        src="/assets/icons/day-crown.svg"
        alt="Day Crown"
      />

      <img
        id="hero-crown-night"
        className={`hero-crown-img float ${theme === "night" ? "active" : ""}`}
        src="/assets/icons/night-crown.svg"
        alt="Night Crown"
      />
    </div>
  );
}
