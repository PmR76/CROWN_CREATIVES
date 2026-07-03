import { useEffect } from "react";
import { initHeroCrown } from "../modules/heroCrownEngine";
import "../styles/hero-crown.css";

export default function HeroCrown() {
  useEffect(() => {
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
        src="/assets/icons/night-crown.svg"
        alt="Night Crown"
      />
    </div>
  );
}
