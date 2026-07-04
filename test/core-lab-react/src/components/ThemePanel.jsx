// ============================================================
// ThemePanel.jsx — SHIFT+T Admin Theme Panel
// ============================================================

import { useEffect } from "react";
import "../styles/theme-panel.css";
import { themeEngine } from "../theme/ThemeEngine";

export default function ThemePanel() {

  useEffect(() => {
    const panel = document.getElementById("themePanel");

    function togglePanel(e) {
      if (e.key === "T" && e.shiftKey) {
        panel.classList.toggle("open");
      }
    }

    window.addEventListener("keydown", togglePanel);
    return () => window.removeEventListener("keydown", togglePanel);
  }, []);

  return (
    <div id="themePanel" className="theme-panel">
      <div className="theme-panel-header">Theme Panel</div>

      <div className="theme-section">
        <h3>Day Theme</h3>
        <button onClick={() => themeEngine.setTheme("day")}>
          Activate Day Theme
        </button>
      </div>

      <div className="theme-section">
        <h3>Night Theme</h3>
        <button onClick={() => themeEngine.setTheme("night")}>
          Activate Night Theme
        </button>
      </div>

      <p className="theme-panel-meta">Press SHIFT + T to close</p>
    </div>
  );
}
