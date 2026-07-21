// ============================================================
// Ticker.jsx — Editable, Draggable, Pausing Cinematic Ticker
// Crown Creatives Editor OS Integration (GR1 Stable)
// ============================================================

import { useEffect, useRef } from "react";
import { useAdmin } from "../admin/AdminContext.jsx";
import "../styles/ticker.css";

export default function Ticker() {
  const { isAdmin, isPaused } = useAdmin();   // ⭐ Global admin + pause state
  const tickerRef = useRef(null);

  // ------------------------------------------------------------
  // LOAD SAVED POSITION (SAFE)
  // ------------------------------------------------------------
  useEffect(() => {
    try {
      const savedPos = JSON.parse(localStorage.getItem("ticker-pos") || "null");
      if (savedPos && tickerRef.current) {
        tickerRef.current.style.left = savedPos.left;
        tickerRef.current.style.top = savedPos.top;
      }
    } catch (err) {
      console.warn("Ticker position load failed:", err);
    }
  }, []);

  // ------------------------------------------------------------
  // DRAG LOGIC (Admin Mode Only, Safe)
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
      try {
        const el = ref.current;
        if (!el) return;

        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        pos.x = e.clientX;
        pos.y = e.clientY;

        let newLeft = el.offsetLeft + dx;
        let newTop = el.offsetTop + dy;

        // ⭐ Snapping (20px grid)
        const snap = 20;
        newLeft = Math.round(newLeft / snap) * snap;
        newTop = Math.round(newTop / snap) * snap;

        el.style.left = `${newLeft}px`;
        el.style.top = `${newTop}px`;
      } catch (err) {
        console.warn("Ticker drag move failed:", err);
      }
    }

    function onMouseUp() {
      try {
        const el = ref.current;
        if (!el) return;

        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        localStorage.setItem(
          "ticker-pos",
          JSON.stringify({
            left: el.style.left,
            top: el.style.top
          })
        );
      } catch (err) {
        console.warn("Ticker drag save failed:", err);
      }
    }

    if (ref.current) {
      ref.current.addEventListener("mousedown", onMouseDown);
    }
  }

  // ------------------------------------------------------------
  // ENABLE DRAGGING WHEN ADMIN MODE ACTIVATES
  // ------------------------------------------------------------
  useEffect(() => {
    try {
      if (isAdmin) {
        tickerRef.current?.classList.add("ticker-edit-mode");
        makeDraggable(tickerRef);
      } else {
        tickerRef.current?.classList.remove("ticker-edit-mode");
      }
    } catch (err) {
      console.warn("Ticker admin mode failed:", err);
    }
  }, [isAdmin]);

  // ------------------------------------------------------------
  // RENDER — STATIC TEXT (Guaranteed Visible)
  // ------------------------------------------------------------
  return (
    <div className={`ticker ${isPaused ? "ticker-paused" : ""}`} ref={tickerRef}>
      <div className="ticker-track">

        <span>CROWN CREATIVES — IMAGINATION BECOMES REALITY</span>
        <span>CINEMATIC UI • MAGICAL GRADIENTS • EDITOR OS</span>
        <span>ARTISTRY • RESILIENCE • IMAGINATION</span>

        {/* Duplicate for seamless loop */}
        <span>CROWN CREATIVES — IMAGINATION BECOMES REALITY</span>
        <span>CINEMATIC UI • MAGICAL GRADIENTS • EDITOR OS</span>
        <span>ARTISTRY • RESILIENCE • IMAGINATION</span>

      </div>
    </div>
  );
}
