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
  style={{
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "540px",   // was 300px
    height: "540px",  // was 300px
    zIndex: 2,
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
      />
    </div>
  );
}
