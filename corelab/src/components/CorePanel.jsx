// C:\DEV\CROWN_CREATIVES\test\core-lab-react\src\components\CorePanel.jsx

import { useEffect, useState } from "react";
import { useDiagnostics } from "../hooks/useDiagnostics";
import "../styles/corepanel.css";

export default function CorePanel() {
  // Unified diagnostics engine
  const { fps, gallery, cards, sentinel } = useDiagnostics();

  const [status, setStatus] = useState({
    header: false,
    footer: false,
    ticker: false,
    heroCrown: false,
    errors: []
  });

  // ------------------------------------------------------------
  // THEME STATUS (GREEN / RED / GREY)
  // ------------------------------------------------------------
  const [themeStatus, setThemeStatus] = useState("grey");

  useEffect(() => {
    function onSnapshot(e) {
      const snap = e.detail;

      console.log("[THEME SNAPSHOT]", snap);

      if (!snap.role || !snap.key || !snap.applied) {
        setThemeStatus("red");
      } else {
        setThemeStatus("green");
      }
    }

    window.addEventListener("theme-snapshot", onSnapshot);
    return () => window.removeEventListener("theme-snapshot", onSnapshot);
  }, []);

  // ------------------------------------------------------------
  // DOM Detection (Header, Footer, Ticker, Crown)
  // ------------------------------------------------------------
  function detectDOM() {
    setStatus(prev => ({
      ...prev,
      header: !!document.querySelector("header, .cc-header, .header"),
      footer: !!document.querySelector("footer, .cc-footer, .footer"),
      ticker: !!document.querySelector(".ticker, .ticker-container, .ticker-wrapper"),
      heroCrown: !!document.querySelector(".hero-crown, .hero-crown-section, .hero-crown-wrapper")
    }));
  }

  useEffect(() => {
    detectDOM();
    const interval = setInterval(detectDOM, 1000);
    return () => clearInterval(interval);
  }, []);

  // ------------------------------------------------------------
  // Error Capture
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // Draggable Panel
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // Render Panel
  // ------------------------------------------------------------
  return (
    <div className="core-panel">
      <div className="core-panel-header">CORE DIAGNOSTICS</div>

      <div className="core-panel-section">
        <div className="core-item">
          Header: <span className={status.header ? "ok" : "fail"}>
            {status.header ? "Loaded" : "Missing"}
          </span>
        </div>

        <div className="core-item">
          Footer: <span className={status.footer ? "ok" : "fail"}>
            {status.footer ? "Loaded" : "Missing"}
          </span>
        </div>

        <div className="core-item">
          Ticker: <span className={status.ticker ? "ok" : "fail"}>
            {status.ticker ? "Running" : "Missing"}
          </span>
        </div>

        <div className="core-item">
          Hero Crown: <span className={status.heroCrown ? "ok" : "fail"}>
            {status.heroCrown ? "Active" : "Missing"}
          </span>
        </div>

        {/* NEW — Unified Diagnostics */}
        <div className="core-item">
          Hero Gallery: <span className={gallery === "Active" ? "ok" : "fail"}>
            {gallery}
          </span>
        </div>

        <div className="core-item">
          Cards: <span className={cards === "Loaded" ? "ok" : "fail"}>
            {cards}
          </span>
        </div>

        <div className="core-item">
          FPS: <span className="ok">{fps}</span>
        </div>

        {/* THEME STATUS */}
        <div className="core-item">
          Theme:{" "}
          <span
            className={
              themeStatus === "green"
                ? "ok"
                : themeStatus === "red"
                ? "fail"
                : "grey"
            }
          >
            {themeStatus}
          </span>
        </div>

        {/* SENTINEL */}
        <div className="core-item">
          Sentinel:{" "}
          <span
            className={
              sentinel === "green"
                ? "ok"
                : sentinel === "amber"
                ? "warn"
                : sentinel === "red"
                ? "fail"
                : "grey"
            }
          >
            {sentinel}
          </span>
        </div>
      </div>

      <div className="core-panel-section">
        <div className="core-item">
          Errors:
          {status.errors.length === 0 ? (
            <span className="ok">None</span>
          ) : (
            <ul className="error-list">
              {status.errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
  