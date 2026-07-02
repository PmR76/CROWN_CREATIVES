import { useEffect } from "react";
import "../styles/hero-crown.css";

export default function HeroCrown() {
  useEffect(() => {
    const day = document.getElementById("hero-crown-day");
    const night = document.getElementById("hero-crown-night");

    if (!day || !night) {
      console.warn("Hero Crown: missing crown images in DOM.");
      return;
    }

    const apply = (theme) => {
      if (theme === "dark") {
        day.style.opacity = "0";
        night.style.opacity = "1";

        document.documentElement.style.setProperty(
          "--crown-glow-color",
          "rgba(120, 200, 255, 0.9)"
        );
      } else {
        day.style.opacity = "1";
        night.style.opacity = "0";

        document.documentElement.style.setProperty(
          "--crown-glow-color",
          "rgba(255, 210, 150, 0.8)"
        );
      }
    };

    // Initial theme
    const initialTheme =
      document.body.dataset.theme === "dark" ? "dark" : "day";
    apply(initialTheme);

    // Listen for theme changes
    document.addEventListener("theme-changed", (e) => {
      apply(e.detail);
    });
  }, []);

  return (
    <div id="hero-crown-container">
      <img
        id="hero-crown-day"
        className="hero-crown"
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
