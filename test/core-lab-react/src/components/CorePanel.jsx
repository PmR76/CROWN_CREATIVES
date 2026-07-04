import { useEffect, useState } from "react";
import "../styles/corepanel.css";

export default function CorePanel() {
  const [status, setStatus] = useState({
    header: false,
    footer: false,
    ticker: false,
    heroCrown: false,
    heroGallery: false,
    cards: false,
    fps: 0,
    errors: []
  });

function detectDOM() {
  setStatus(prev => ({
    ...prev,

    header: !!document.querySelector("header, .cc-header, .header"),

    footer: !!document.querySelector("footer, .cc-footer, .footer"),

    ticker: !!document.querySelector(".ticker, .ticker-container, .ticker-wrapper"),

    heroCrown: !!document.querySelector(
      ".hero-crown, .hero-crown-section, .hero-crown-wrapper"
    ),

    heroGallery: !!document.querySelector(
      ".hero-gallery, .hero-gallery-section, .hero-gallery-wrapper, .gallery-lane"
    ),

    cards: !!document.querySelector(
      ".cards, .cards-container, .card-grid, .card-container"
    )
  }));
}

  useEffect(() => {
    detectDOM();
    const interval = setInterval(detectDOM, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let last = performance.now();
    let frames = 0;

    function measure(now) {
      frames++;
      if (now - last >= 1000) {
        setStatus(prev => ({ ...prev, fps: frames }));
        frames = 0;
        last = now;
      }
      requestAnimationFrame(measure);
    }

    requestAnimationFrame(measure);
  }, []);

  useEffect(() => {
    function onError(e) {
      setStatus(prev => ({
        ...prev,
        errors: [...prev.errors, e.message]
      }));
    }

    window.addEventListener("error", onError);
    return () => window.removeEventListener("error", onError);
  }, []);

  // Draggable panel
  useEffect(() => {
    const panel = document.querySelector(".core-panel");
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    function onMouseDown(e) {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;

      const rect = panel.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      document.body.style.userSelect = "none";
    }

    function onMouseMove(e) {
      if (!dragging) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      panel.style.left = `${initialLeft + dx}px`;
      panel.style.top = `${initialTop + dy}px`;
    }

    function onMouseUp() {
      dragging = false;
      document.body.style.userSelect = "";
    }

    panel.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      panel.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div className="core-panel">
      <div className="core-panel-header">CORE DIAGNOSTICS</div>

      <div className="core-panel-section">
        <div className="core-item">Header: <span className={status.header ? "ok" : "fail"}>{status.header ? "Loaded" : "Missing"}</span></div>
        <div className="core-item">Footer: <span className={status.footer ? "ok" : "fail"}>{status.footer ? "Loaded" : "Missing"}</span></div>
        <div className="core-item">Ticker: <span className={status.ticker ? "ok" : "fail"}>{status.ticker ? "Running" : "Missing"}</span></div>
        <div className="core-item">Hero Crown: <span className={status.heroCrown ? "ok" : "fail"}>{status.heroCrown ? "Active" : "Missing"}</span></div>
        <div className="core-item">Hero Gallery: <span className={status.heroGallery ? "ok" : "fail"}>{status.heroGallery ? "Active" : "Missing"}</span></div>
        <div className="core-item">Cards: <span className={status.cards ? "ok" : "fail"}>{status.cards ? "Loaded" : "Missing"}</span></div>
        <div className="core-item">FPS: <span className="ok">{status.fps}</span></div>
      </div>

      <div className="core-panel-section">
        <div className="core-item">
          Errors:
          {status.errors.length === 0 ? (
            <span className="ok">None</span>
          ) : (
            <ul className="error-list">
              {status.errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
