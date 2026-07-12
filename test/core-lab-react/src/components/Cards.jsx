// ============================================================
// Cards.jsx — Frosted Cards + Admin Drag
// ============================================================

import { useEffect } from "react";
import "./../styles/cards.css";

export default function Cards() {

  // ------------------------------------------------------------
  // ADMIN MODE — Make the three cards draggable
  // ------------------------------------------------------------
  useEffect(() => {
    if (document.body.dataset.admin !== "true") return;

    const cards = document.querySelectorAll(".frost-card");
    if (!cards.length) return;

    cards.forEach((card) => {
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

        card.style.left = card.offsetLeft + dx + "px";
        card.style.top = card.offsetTop + dy + "px";
      }

      function onMouseUp() {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }

      card.addEventListener("mousedown", onMouseDown);
    });

  }, []);

  // ------------------------------------------------------------
  // RENDER — Frosted Cards
  // ------------------------------------------------------------
  return (
    <div id="cc-cards" className="cc-cards">
      <div className="cards-wrapper">

        <div className="frost-card">
          <h2>Artistry</h2>
          <p>Creativity expressed through craft, vision, and imagination.</p>
        </div>

        <div className="frost-card">
          <h2>Resilience</h2>
          <p>Strength to rise, rebuild, and transform challenges into growth.</p>
        </div>

        <div className="frost-card">
          <h2>Imagination</h2>
          <p>The spark that turns ideas into reality and stories into worlds.</p>
        </div>

      </div>
    </div>
  );
}
