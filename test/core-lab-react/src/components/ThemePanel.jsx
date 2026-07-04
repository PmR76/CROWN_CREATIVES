import { useEffect, useState } from "react";
import "../styles/theme-panel.css";
import { themeEngine } from "../theme/ThemeEngine";

export default function ThemePanel() {
  const dayThemes = [
    "sunrise", "warm-daylight", "soft-sky", "sunset-glow",
    "ocean-mist", "royal-ember", "solar-bloom", "crown-platinum",
    "golden-horizon", "peach-bloom", "skyline-blue", "honey-aura",
    "daybreak-rose", "citrus-warmth", "azure-cloud", "opal-morning"
  ];

  const nightThemes = [
    "midnight-indigo", "royal-night", "aurora", "deep-space",
    "deep-velvet", "cosmic-royal", "nebula-drift", "crown-nocturne",
    "obsidian-dusk", "violet-comet", "galaxy-fade", "lunar-ice",
    "nocturnal-ember", "shadow-royal", "midnight-teal", "stellar-drift"
  ];

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedNight, setSelectedNight] = useState(null);

  useEffect(() => {
    const panel = document.getElementById("themePanel");

    function togglePanel(e) {
      if (!window.__IS_ADMIN__) return;
      if (e.key === "A" && e.shiftKey) {
        panel.classList.toggle("open");
      }
    }

    window.addEventListener("keydown", togglePanel);
    return () => window.removeEventListener("keydown", togglePanel);
  }, []);

  useEffect(() => {
    const page = window.__PAGE__ || "default";
    setSelectedDay(localStorage.getItem(`${page}-dayThemeKey`));
    setSelectedNight(localStorage.getItem(`${page}-nightThemeKey`));
  }, []);

  useEffect(() => {
    themeEngine.loadPageTheme();
  }, []);

  function applyTheme(role, key) {
    themeEngine.setBackgroundTheme(role, key);
    const page = window.__PAGE__ || "default";

    if (role === "day") {
      setSelectedDay(key);
      localStorage.setItem(`${page}-dayThemeKey`, key);
    } else {
      setSelectedNight(key);
      localStorage.setItem(`${page}-nightThemeKey`, key);
    }
  }

  function randomDay() {
    themeEngine.setRandomTheme("day", dayThemes);
    const page = window.__PAGE__ || "default";
    const randomKey = dayThemes[Math.floor(Math.random() * dayThemes.length)];
    setSelectedDay(randomKey);
    localStorage.setItem(`${page}-dayThemeKey`, randomKey);
  }

  function randomNight() {
    themeEngine.setRandomTheme("night", nightThemes);
    const page = window.__PAGE__ || "default";
    const randomKey = nightThemes[Math.floor(Math.random() * nightThemes.length)];
    setSelectedNight(randomKey);
    localStorage.setItem(`${page}-nightThemeKey`, randomKey);
  }

useEffect(() => {
  const panel = document.getElementById("themePanel");
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

  return (
    <div className="theme-panel" id="themePanel">
      <div className="theme-panel-header">Theme Panel (Admin — SHIFT + A)</div>

      <div className="theme-panel-section-label">Day Themes</div>
      <div className="theme-swatch-grid">
        {dayThemes.map(key => (
          <div
            key={key}
            className={`theme-swatch ${selectedDay === key ? "selected" : ""}`}
            style={{ background: `var(--grad-${key})` }}
            onClick={() => applyTheme("day", key)}
          />
        ))}
      </div>

      <button className="theme-panel-button" onClick={randomDay}>
        Random Day Theme
      </button>

      <div className="theme-panel-section-label">Night Themes</div>
      <div className="theme-swatch-grid">
        {nightThemes.map(key => (
          <div
            key={key}
            className={`theme-swatch ${selectedNight === key ? "selected" : ""}`}
            style={{ background: `var(--grad-${key})` }}
            onClick={() => applyTheme("night", key)}
          />
        ))}
      </div>

      <button className="theme-panel-button" onClick={randomNight}>
        Random Night Theme
      </button>

      <p className="theme-panel-meta">
        Admin only — press SHIFT + A to open/close.
      </p>
    </div>
  );
}
