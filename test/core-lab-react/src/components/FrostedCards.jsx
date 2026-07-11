// ============================================================
// FrostedCards.jsx — Editable, Draggable Frosted Glass Ad Panels
// Crown Creatives Editor OS Integration
// ============================================================

import { useEffect, useRef } from "react";
import { useAdmin } from "../admin/AdminContext";
import "../styles/frosted-cards.css";

export default function FrostedCards({ cardsConfig }) {
  const { isAdmin, isPaused } = useAdmin();

  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);

  // ------------------------------------------------------------
  // LOAD SAVED POSITIONS
  // ------------------------------------------------------------
  useEffect(() => {
    const saved1 = JSON.parse(localStorage.getItem("card1-pos"));
    const saved2 = JSON.parse(localStorage.getItem("card2-pos"));
    const saved3 = JSON.parse(localStorage.getItem("card3-pos"));

    if (saved1 && card1Ref.current) {
      card1Ref.current.style.left = saved1.left;
      card1Ref.current.style.top = saved1.top;
    }
    if (saved2 && card2Ref.current) {
      card2Ref.current.style.left = saved2.left;
      card2Ref.current.style.top = saved2.top;
    }
    if (saved3 && card3Ref.current) {
      card3Ref.current.style.left = saved3.left;
      card3Ref.current.style.top = saved3.top;
    }
  }, []);

  // ------------------------------------------------------------
  // DRAG LOGIC (Admin Mode Only)
  // ------------------------------------------------------------
  function makeDraggable(ref, storageKey) {
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

      const el = ref.current;
      let newLeft = el.offsetLeft + dx;
      let newTop = el.offsetTop + dy;

      // ⭐ Snapping grid (20px increments)
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
        storageKey,
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
      card1Ref.current?.classList.add("card-edit-mode");
      card2Ref.current?.classList.add("card-edit-mode");
      card3Ref.current?.classList.add("card-edit-mode");

      makeDraggable(card1Ref, "card1-pos");
      makeDraggable(card2Ref, "card2-pos");
      makeDraggable(card3Ref, "card3-pos");
    } else {
      card1Ref.current?.classList.remove("card-edit-mode");
      card2Ref.current?.classList.remove("card-edit-mode");
      card3Ref.current?.classList.remove("card-edit-mode");
    }
  }, [isAdmin]);

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <section className={`frosted-cards ${isPaused ? "cards-paused" : ""}`}>
      
      {/* CARD 1 */}
      <div ref={card1Ref} className="frosted-card">
        <h3>Artistry</h3>
        <p>{cardsConfig[0]}</p>
      </div>

      {/* CARD 2 */}
      <div ref={card2Ref} className="frosted-card">
        <h3>Resilience</h3>
        <p>{cardsConfig[1]}</p>
      </div>

      {/* CARD 3 */}
      <div ref={card3Ref} className="frosted-card">
        <h3>Imagination</h3>
        <p>{cardsConfig[2]}</p>
      </div>

    </section>
  );
}
