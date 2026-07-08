import { useEffect } from "react";
import { initHeroCrown } from "../shared/heroCrownEngine";

export default function HeroCrown() {
  useEffect(() => {
    // Initialize crown theme-reactive logic
    initHeroCrown(document);
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
        src="/assets/icons/night-crown.png"
        alt="Night Crown"
      />
    </div>
  );
}
