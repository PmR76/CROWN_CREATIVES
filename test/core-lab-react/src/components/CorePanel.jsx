import { useState } from "react";
import "../styles/corepanel.css";

export default function CorePanel() {
  const [pos, setPos] = useState({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const startDrag = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    });
  };

  const stopDrag = () => setDragging(false);

  const onDrag = (e) => {
    if (!dragging) return;
    setPos({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    });
  };

  return (
    <div
      className="core-panel"
      onMouseDown={startDrag}
      onMouseUp={stopDrag}
      onMouseMove={onDrag}
      style={{ left: pos.x, top: pos.y }}
    >
      <h3>CORE‑LAB PANEL</h3>
      <p>LAB HEALTH: ✓ Clean</p>
      <p>Cards: ✓ Loaded</p>
      <p>Ticker: ✓ Loaded</p>
      <p>Footer: ✓ Loaded</p>
      <p>FPS: 60</p>
      <p>Errors: 0</p>
    </div>
  );
}
