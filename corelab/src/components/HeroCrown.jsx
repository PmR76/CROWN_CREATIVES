// ============================================================
// HeroCrown.jsx — Cinematic Crown (8s Transition + Admin Drag)
// ============================================================

import { useEffect } from "react";

export default function HeroCrown() {

  // ------------------------------------------------------------
  // THEME SWITCHING — Day ↔ Night (with 50ms fade sync)
  // ------------------------------------------------------------
  useEffect(() => {
    const day = document.getElementById("hero-crown-day");
    const night = document.getElementById("hero-crown-night");

    if (!day || !night) return;

    const apply = (theme) => {
      if (theme === "night") {
        // Fade day out
        day.classList.remove("active");

        // Delay night fade-in so CSS can animate
        setTimeout(() => {
          night.classList.add("active");
        }, 50);

      } else {
        night.classList.remove("active");

        setTimeout(() => {
          day.classList.add("active");
        }, 50);
      }
    };

    // Initial theme
    const initialTheme =
      document.body.dataset.theme === "night" ? "night" : "day";

    apply(initialTheme);

    // Listen for theme changes
    const handler = (e) => apply(e.detail);
    window.addEventListener("theme-set", handler);

    return () => window.removeEventListener("theme-set", handler);
  }, []);

  // ------------------------------------------------------------
  // ADMIN MODE — Drag Crown Wrapper
  // ------------------------------------------------------------
  useEffect(() => {
    const wrapper = document.querySelector(".hero-crown-wrapper");
    if (!wrapper) return;

    let pos = { x: 0, y: 0 };

    function onMouseDown(e) {
      if (document.body.dataset.admin !== "true") return;

      pos.x = e.clientX;
      pos.y = e.clientY;

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }

    function onMouseMove(e) {
      const dx = e.clientX - pos.x;
      const dy = e.clientY - pos.y;

      pos.x = e.clientX;
      pos.y = e.clientY;

      wrapper.style.left = wrapper.offsetLeft + dx + "px";
      wrapper.style.top = wrapper.offsetTop + dy + "px";
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    wrapper.addEventListener("mousedown", onMouseDown);

    return () => wrapper.removeEventListener("mousedown", onMouseDown);
  }, []);

  // ------------------------------------------------------------
  // RENDER — Correct Wrapper + Correct Classes
  // ------------------------------------------------------------
  return (
    <div className="hero-crown-wrapper">
      <img
        id="hero-crown-day"
        className="hero-crown-img float active"
        src="/assets/icons/day-crown.svg"
        alt="Day Crown"
      />

      <img
        id="hero-crown-night"
        className="hero-crown-img float"
        src="/assets/icons/night-crown.svg"
        alt="Night Crown"
      />
    </div>
  );
}
