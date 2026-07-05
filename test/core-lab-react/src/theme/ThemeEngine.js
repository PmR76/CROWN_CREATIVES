import { useEffect, useState } from "react";
import "../styles/theme-panel.css";
import { themeEngine } from "../theme/ThemeEngine";

export default function ThemePanel() {
  const [isOpen, setIsOpen] = useState(false);

  // ------------------------------------------------------------
  // SHIFT + A — Toggle Panel
  // ------------------------------------------------------------
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "A" && e.shiftKey) {
        setIsOpen(prev => !prev);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // ------------------------------------------------------------
  // Draggable Panel
  // ------------------------------------------------------------
  useEffect(() => {
    const panel = document.getElementById("themePanel");
    if (!panel) return;

    const header = panel.querySelector(".theme-panel-header");
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    function onMouseDown(e) {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = panel.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      document.body.style.userSelect = "none";
    }

    function onMouseMove(e) {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      panel.style.left = `${initialLeft + dx}px`;
      panel.style.top = `${initialTop + dy}px`;
    }

    function onMouseUp() {
      isDragging = false;
      document.body.style.userSelect = "";
    }

    header.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      header.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  return (
    <div
      id="themePanel"
      className={`theme-panel ${isOpen ? "open" : ""}`}
    >
      <div className="theme-panel-header">
        Theme Panel (SHIFT + A)
      </div>

      {/* Your swatches + buttons remain unchanged */}
    </div>
  );
}
