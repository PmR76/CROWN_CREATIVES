import React, { useEffect, useState } from "react";

export default function ThemePanel() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.key.toLowerCase() === "a" && e.shiftKey) {
        setVisible((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const setTheme = (theme) => {
    document.body.dataset.theme = theme;
    window.dispatchEvent(new CustomEvent("theme-set", { detail: theme }));
  };

  if (!visible) return null;

  return (
    <div className="theme-panel">
      <div className="theme-panel-inner">
        <h2>Theme Lab</h2>
        <div className="theme-swatches">
          <button onClick={() => setTheme("day")}>Day</button>
          <button onClick={() => setTheme("dark")}>Night</button>
        </div>
        <p>Press SHIFT+A to toggle this panel.</p>
      </div>
    </div>
  );
}
