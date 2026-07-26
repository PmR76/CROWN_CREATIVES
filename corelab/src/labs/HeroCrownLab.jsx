// ============================================================
// HeroCrownLab.jsx — Day/Night Crown (Theme Reactive)
// ============================================================

import { useEffect, useState } from "react";

export default function HeroCrownLab() {
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const handler = () => setIsNight((prev) => !prev);
    window.addEventListener("themeChanged", handler);
    return () => window.removeEventListener("themeChanged", handler);
  }, []);

  return (
    <div
      className="hero-crown-lab-wrapper"
      style={{
        position: "relative",
        width: "540px",
        height: "540px",
        margin: "0 auto",
        marginTop: "40px",
      }}
    >
      <img
        src="/assets/icons/day-crown.svg"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: isNight ? 0 : 1,
          transition: "opacity 8s ease-in-out",
        }}
        alt="Day Crown"
      />

      <img
        src="/assets/icons/night-crown.svg"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: isNight ? 1 : 0,
          transition: "opacity 8s ease-in-out",
        }}
        alt="Night Crown"
      />
    </div>
  );
}
