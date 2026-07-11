// ============================================================
// Ticker.jsx — Editable, Draggable, Pausing Cinematic Ticker
// Crown Creatives Editor OS Integration
// ============================================================

import { useEffect, useRef } from "react";
import { useAdmin } from "../admin/AdminContext";
import "../styles/ticker.css";

export default function Ticker({ tickerText }) {
  const { isAdmin, isPaused } = useAdmin();   // ⭐ Global admin + pause state
  const tickerRef = useRef(null);

  // ------------------------------------------------------------
  // LOAD SAVED POSITION
  // ------------------------------------------------------------
  useEffect(() => {
    const savedPos = JSON.parse(localStorage.getItem("ticker-pos"));
    if (savedPos && tickerRef.current) {
      tickerRef.current.style.left = savedPos.left;
      tickerRef.current.style.top = savedPos.top;
    }
  }, []);

  // ------------------------------------------------------------
  // DRAG LOGIC (Admin Mode Only)
  // ------------------------------------------------------------
  function makeDraggable(ref) {
    let pos = { x: 0, y: 0 };

    function onMouseDown(e) {
      if (!isAdmin) return;  // ⭐ Only draggable in admin mode
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

      const el = ref.current;
      let newLeft = el.offsetLeft + dx;
      let newTop = el.offsetTop + dy;

      // ⭐ Snapping (20px grid)
      const snap = 20;
      newLeft = Math.round(newLeft / snap) * snap;
      newTop = Math.round(newTop / snap) * snap;

      el.style.left = newLeft + "px";
      el.style.top = newTop + "px";
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      const el = ref.current;
      localStorage.setItem(
        "ticker-pos",
        JSON.stringify({
          left: el.style.left,
          top: el.style.top,
        })
      );
    }

    if (ref.current) {
      ref.current.addEventListener("mousedown", onMouseDown);
    }
  }

  // ------------------------------------------------------------
  // ENABLE DRAGGING WHEN ADMIN MODE ACTIVATES
  // ------------------------------------------------------------
  useEffect(() => {
    if (isAdmin) {
      tickerRef.current?.classList.add("ticker-edit-mode");
      makeDraggable(tickerRef);
    } else {
      tickerRef.current?.classList.remove("ticker-edit-mode");
    }
  }, [isAdmin]);

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <div className={`ticker ${isPaused ? "ticker-paused" : ""}`} ref={tickerRef}>
      <div className="ticker-track">
        <span>{tickerText}</span>
        <span>{tickerText}</span>
        <span>{tickerText}</span>

        {/* Duplicate for seamless loop */}
        <span>{tickerText}</span>
        <span>{tickerText}</span>
        <span>{tickerText}</span>
      </div>
    </div>
  );
}
