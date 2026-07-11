// ============================================================
// AdminPanel.jsx — Crown Creatives Editor OS Control Panel
// ============================================================

import { useAdmin } from "./AdminContext";
import { useState, useEffect } from "react";

export default function AdminPanel({
  cardsConfig,
  setCardsConfig,
  tickerText,
  setTickerText,
  gradients,
  currentTheme,
  setCurrentTheme
}) {
  const { exitAdmin } = useAdmin();

  const [localCards, setLocalCards] = useState(cardsConfig);
  const [localTicker, setLocalTicker] = useState(tickerText);
  const [localTheme, setLocalTheme] = useState(currentTheme);

  // Load saved values on mount
  useEffect(() => {
    const savedCards = JSON.parse(localStorage.getItem("cardsConfig"));
    const savedTicker = localStorage.getItem("tickerText");
    const savedTheme = localStorage.getItem("currentTheme");

    if (savedCards) setLocalCards(savedCards);
    if (savedTicker) setLocalTicker(savedTicker);
    if (savedTheme) setLocalTheme(savedTheme);
  }, []);

  function handleSave() {
    // Persist everything
    localStorage.setItem("cardsConfig", JSON.stringify(localCards));
    localStorage.setItem("tickerText", localTicker);
    localStorage.setItem("currentTheme", localTheme);

    // Push values back to app state
    setCardsConfig(localCards);
    setTickerText(localTicker);
    setCurrentTheme(localTheme);

    // Exit admin mode → resume OS
    exitAdmin();
  }

  return (
    <div className="admin-panel">
      <h2 className="admin-panel-title">Crown Creatives Editor OS</h2>

      {/* ======================================================
         SECTION: Colour Swatches (Day/Night Gradients)
      ====================================================== */}
      <section className="admin-section">
        <h3 className="admin-section-title">Colour Swatches</h3>
        <p className="admin-section-subtitle">Day & Night Gradient Themes</p>

        <div className="swatch-grid">
          {gradients.map((g, i) => (
            <button
              key={i}
              className={`swatch ${localTheme === g.id ? "active" : ""}`}
              style={{ background: g.preview }}
              onClick={() => setLocalTheme(g.id)}
            />
          ))}
        </div>
      </section>

      {/* ======================================================
         SECTION: Frosted Cards Text
      ====================================================== */}
      <section className="admin-section">
        <h3 className="admin-section-title">Frosted Cards (Ad Panels)</h3>

        <label className="admin-label">
          Card 1 Text
          <input
            className="admin-input"
            value={localCards[0]}
            onChange={(e) =>
              setLocalCards((prev) => {
                const next = [...prev];
                next[0] = e.target.value;
                return next;
              })
            }
          />
        </label>

        <label className="admin-label">
          Card 2 Text
          <input
            className="admin-input"
            value={localCards[1]}
            onChange={(e) =>
              setLocalCards((prev) => {
                const next = [...prev];
                next[1] = e.target.value;
                return next;
              })
            }
          />
        </label>

        <label className="admin-label">
          Card 3 Text
          <input
            className="admin-input"
            value={localCards[2]}
            onChange={(e) =>
              setLocalCards((prev) => {
                const next = [...prev];
                next[2] = e.target.value;
                return next;
              })
            }
          />
        </label>
      </section>

      {/* ======================================================
         SECTION: Ticker Text
      ====================================================== */}
      <section className="admin-section">
        <h3 className="admin-section-title">Ticker Text</h3>

        <input
          className="admin-input"
          value={localTicker}
          onChange={(e) => setLocalTicker(e.target.value)}
        />
      </section>

      {/* ======================================================
         SAVE BUTTON
      ====================================================== */}
      <button className="admin-save-button" onClick={handleSave}>
        Save & Exit Admin
      </button>
    </div>
  );
}
