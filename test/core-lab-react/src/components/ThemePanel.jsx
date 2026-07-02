import { useEffect, useRef } from "react";
import "../styles/theme-panel.css";

export default function ThemePanel() {
  const panelRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const panel = panelRef.current;
    const header = headerRef.current;

    let isAdmin = localStorage.getItem("cc-admin") === "true";
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const keyHandler = (e) => {
      if (e.key === "T" && e.shiftKey) {
        if (!isAdmin) {
          const pass = prompt("Enter admin password:");
          if (pass === "CROWN2026") {
            isAdmin = true;
            localStorage.setItem("cc-admin", "true");
            alert("Admin mode unlocked");
          } else return;
        }
        panel.classList.toggle("theme-panel-visible");
      }
    };

    window.addEventListener("keydown", keyHandler);

    const mouseDown = (e) => {
      isDragging = true;
      offsetX = e.clientX - panel.offsetLeft;
      offsetY = e.clientY - panel.offsetTop;
      panel.classList.add("theme-panel-dragging");
    };

    const mouseMove = (e) => {
      if (isDragging) {
        panel.style.left = `${e.clientX - offsetX}px`;
        panel.style.top = `${e.clientY - offsetY}px`;
      }
    };

    const mouseUp = () => {
      isDragging = false;
      panel.classList.remove("theme-panel-dragging");
    };

    header.addEventListener("mousedown", mouseDown);
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);

    return () => {
      window.removeEventListener("keydown", keyHandler);
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
    };
  }, []);

  return (
    <div id="theme-panel" ref={panelRef} className="cc-theme-panel">
      <div id="theme-panel-header" ref={headerRef}>
        <div id="theme-panel-title">Background Themes</div>
        <div id="theme-panel-timestamp">
          Loaded: {new Date().toLocaleString()}
        </div>
        <div id="theme-panel-close">✕</div>
      </div>

      <div className="theme-panel-body">
        {/* Swatches will be added later */}
      </div>
    </div>
  );
}
