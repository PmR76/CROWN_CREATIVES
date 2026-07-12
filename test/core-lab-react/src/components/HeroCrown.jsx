// ============================================================
// HeroCrown.jsx — Cinematic Crown + Admin Drag + Save Position
// ============================================================

import { useEffect, useRef } from "react";
import { useAdmin } from "../admin/AdminContext";

export default function HeroCrown() {
  const { isAdmin } = useAdmin();
  const wrapperRef = useRef(null);

  // ------------------------------------------------------------
  // LOAD SAVED POSITION
  // ------------------------------------------------------------
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("hero-crown-pos"));
    if (saved && wrapperRef.current) {
      wrapperRef.current.style.left = saved.left;
      wrapperRef.current.style.top = saved.top;
    }
  }, []);

  // ------------------------------------------------------------
  // DRAG LOGIC (Admin Mode Only)
  // ------------------------------------------------------------
  useEffect(() => {
    if (!wrapperRef.current) return;

    const el = wrapperRef.current;
    let pos = { x: 0, y: 0 };

    function onMouseDown(e) {
      if (!isAdmin) return;
      e.preventDefault();

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

      let newLeft = el.offsetLeft + dx;
      let newTop = el.offsetTop + dy;

      // ⭐ Snap to 20px grid
      const snap = 20;
      newLeft = Math.round(newLeft / snap) * snap;
      newTop = Math.round(newTop / snap) * snap;

      el.style.left = newLeft + "px";
      el.style.top = newTop + "px";
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      // ⭐ Save position
      localStorage.setItem(
        "hero-crown-pos",
        JSON.stringify({
          left: el.style.left,
          top: el.style.top,
        })
      );
    }

    el.addEventListener("mousedown", onMouseDown);

    return () => el.removeEventListener("mousedown", onMouseDown);
  }, [isAdmin]);

  // ------------------------------------------------------------
  // THEME SWITCHING (Day/Night)
  // ------------------------------------------------------------
  useEffect(() => {
    const day = document.getElementById("hero-crown-day");
    const night = document.getElementById("hero-crown-night");

    if (!day || !night) return;

    const apply = (theme) => {
      if (theme === "night") {
        day.classList.remove("active");
        night.classList.add("active");
      } else {
        night.classList.remove("active");
        day.classList.add("active");
      }
    };

    const initialTheme =
      document.body.dataset.theme === "night" ? "night" : "day";

    apply(initialTheme);

    const handler = (e) => apply(e.detail);
    window.addEventListener("theme-set", handler);

    return () => window.removeEventListener("theme-set", handler);
  }, []);

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <div ref={wrapperRef} className="hero-crown-wrapper">
      <img
        id="hero-crown-day"
        className="hero-crown-img float"
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
