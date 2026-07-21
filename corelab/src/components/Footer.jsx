// ============================================================
// Footer.jsx — Core Lab Footer (GR1 Stable)
// ============================================================

import { useCallback, useEffect } from "react";
import "../styles/footer.css";

export default function Footer() {

  /* ============================================================
     FOOTER GLOW DIAGNOSTICS (runs every 1s)
     — Safe in Dev Mode Only
  ============================================================= */
  useEffect(() => {
    // Only run diagnostics in localhost or ?dev=true
    const isDev =
      window.location.hostname === "localhost" ||
      window.location.search.includes("dev=true");

    if (!isDev) return;

    const footer = document.querySelector(".footer-glass");
    if (!footer) return;

    let anim;
    try {
      anim = footer.getAnimations()[0];
    } catch {
      anim = null;
    }

    const debug = () => {
      try {
        const style = getComputedStyle(footer);

        console.table({
          animationName: style.animationName,
          animationDuration: style.animationDuration,
          animationTimingFunction: style.animationTimingFunction,
          animationIterationCount: style.animationIterationCount,
          playState: anim?.playState,
          currentTime: anim?.currentTime,
          boxShadow: style.boxShadow,
          backdropFilter: style.backdropFilter,
          filter: style.filter,
          border: style.border,
          outline: style.outline,
          zIndex: style.zIndex,
          width: footer.offsetWidth,
          height: footer.offsetHeight
        });
      } catch (err) {
        console.warn("Footer diagnostics failed:", err);
      }
    };

    const interval = setInterval(debug, 1000);
    return () => clearInterval(interval);
  }, []);

  /* ============================================================
     ICON HANDLERS
  ============================================================= */
  const handleIconClick = useCallback((id) => {
    try {
      const links = {
        facebook: "https://facebook.com/crowncreatives",
        instagram: "https://instagram.com/crowncreatives",
        email: "mailto:contact@crowncreatives.com",
        copilot: "https://copilot.microsoft.com"
      };

      const url = links[id];
      if (!url) return;

      window.open(url, "_blank");
    } catch (err) {
      console.warn("Footer icon click failed:", err);
    }
  }, []);

  const handleBackToTop = useCallback(() => {
    try {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } catch (err) {
      console.warn("Back-to-top failed:", err);
    }
  }, []);

  /* ============================================================
     FOOTER RENDER
  ============================================================= */
  return (
    <footer id="cc-footer" className="cc-footer">
      <div className="footer-glass">

        <div className="footer-icons">
          <img
            src="/assets/icons/facebook.svg"
            alt="Facebook"
            className="footer-icon"
            onClick={() => handleIconClick("facebook")}
          />
          <img
            src="/assets/icons/instagram.svg"
            alt="Instagram"
            className="footer-icon"
            onClick={() => handleIconClick("instagram")}
          />
          <img
            src="/assets/icons/email.svg"
            alt="Email"
            className="footer-icon"
            onClick={() => handleIconClick("email")}
          />
          <img
            src="/assets/icons/copilot.svg"
            alt="Copilot"
            className="footer-icon"
            onClick={() => handleIconClick("copilot")}
          />
        </div>

        <button
          id="back-to-top"
          className="back-to-top"
          onClick={handleBackToTop}
        >
          ▲
        </button>

        <div className="footer-copy">
          © 2026 Crown Creatives — All Rights Reserved<br />
          Royalty‑Free Music Provided by Pixabay
        </div>

      </div>
    </footer>
  );
}
