import { useEffect, useState } from "react";
import { initThemeEngine } from "../theme/themeEngine.js";

export default function HeroCrown() {
  const [theme, setTheme] = useState("day");

  useEffect(() => {
    // Initialise your existing theme engine
    initThemeEngine();

    // Read the theme directly from the DOM (your engine sets this)
    const currentTheme = document.body.dataset.theme || "day";
    setTheme(currentTheme);

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      setTheme(document.body.dataset.theme || "day");
    });

    observer.observe(document.body, { attributes: true });

    return () => observer.disconnect();
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
