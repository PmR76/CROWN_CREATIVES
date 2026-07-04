import { useEffect } from "react";
import "../styles/theme-panel.css";
import { themeEngine } from "../theme/ThemeEngine";

export default function ThemePanel() {

  useEffect(() => {
    const panel = document.getElementById("themePanel");

    function togglePanel(e) {
      // ADMIN ONLY
      if (!window.__IS_ADMIN__) return;

      // SHIFT + A toggles panel
      if (e.key === "A" && e.shiftKey) {
        panel.classList.toggle("open");
      }
    }

    window.addEventListener("keydown", togglePanel);
    return () => window.removeEventListener("keydown", togglePanel);
  }, []);

  const dayThemes = [
    "sunrise",
    "warm-daylight",
    "soft-sky",
    "sunset-glow",
    "ocean-mist",
    "royal-ember",
    "solar-bloom",
    "crown-platinum"
  ];

  const nightThemes = [
    "midnight-indigo",
    "royal-night",
    "aurora",
    "deep-space",
    "deep-velvet",
    "cosmic-royal",
    "nebula-drift",
    "crown-nocturne"
  ];

  function applyTheme(role, key) {
    themeEngine.setBackgroundTheme(role, key);
  }

  return (
    <div id="themePanel" className="theme-panel">

      <div className="theme-panel-header">Theme Panel</div>

      <div className="theme-panel-section-label">Day Themes</div>
      <div className="theme-swatch-grid">
        {dayThemes.map(key => (
          <div
            key={key}
            className="theme-swatch"
            style={{ background: `var(--grad-${key})` }}
            onClick={() => applyTheme("day", key)}
          />
        ))}
      </div>

      <div className="theme-panel-section-label">Night Themes</div>
      <div className="theme-swatch-grid">
        {nightThemes.map(key => (
          <div
            key={key}
            className="theme-swatch"
            style={{ background: `var(--grad-${key})` }}
            onClick={() => applyTheme("night", key)}
          />
        ))}
      </div>

      <p className="theme-panel-meta">Press SHIFT + A to close</p>
    </div>
  );
}
