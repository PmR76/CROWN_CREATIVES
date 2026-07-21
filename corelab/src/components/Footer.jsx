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
    const footer = document.querySelector(".footer-glass");
    if (!footer) return;

    const anim = footer.getAnimations()[0];

    const debug = () => {
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
    };

    const interval = setInterval(debug, 1000);
    return () => clearInterval(interval);
  }, []);

  /* ============================================================
     ICON HANDLERS
  ============================================================= */
  const handleIconClick = useCallback((id) => {
    const links = {
      facebook: "https://facebook.com/crowncreatives",
      instagram: "https://instagram.com/crowncreatives",
      email: "mailto:contact@crowncreatives.com",
      copilot: "https://copilot.microsoft.com"
    };

    window.open(links[id], "_blank");
  }, []);

  const handleBackToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
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
            className="footer-icon"
            onClick={() => handleIconClick("facebook")}
          />
          <img
            src="/assets/icons/instagram.svg"
            className="footer-icon"
            onClick={() => handleIconClick("instagram")}
          />
          <img
            src="/assets/icons/email.svg"
            className="footer-icon"
            onClick={() => handleIconClick("email")}
          />
          <img
            src="/assets/icons/copilot.svg"
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
