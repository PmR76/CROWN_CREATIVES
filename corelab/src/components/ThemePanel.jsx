import React, { useEffect } from "react";
import "../theme-panel/themePanel.css";

export default function ThemePanel() {
  useEffect(() => {
    if (window.initThemePanel) {
      window.initThemePanel();
    }
  }, []);

  return (
    <div className="theme-panel-container">
      {/* The actual UI is injected by themePanel.js */}
    </div>
  );
}
