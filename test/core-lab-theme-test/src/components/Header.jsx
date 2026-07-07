import React from "react";

export default function Header() {
  const toggleTheme = () => {
    const current = document.body.dataset.theme === "dark" ? "dark" : "day";
    const next = current === "dark" ? "day" : "dark";
    document.body.dataset.theme = next;
    window.dispatchEvent(new CustomEvent("theme-set", { detail: next }));
  };

  return (
    <header className="hero-header">
      <div className="hero-header-left">
        <span className="brand-mark">Crown Creatives</span>
      </div>

      <div className="hero-header-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          <img
            src="/assets/icons/sun-moon2.png"
            alt="Theme toggle"
            className="theme-toggle-icon"
          />
        </button>

        <button className="sound-toggle" disabled>
          <img
            src="/assets/icons/music.png"
            alt="Sound icon"
            className="sound-toggle-icon"
          />
        </button>
      </div>
    </header>
  );
}
