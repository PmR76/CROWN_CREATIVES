import { useCallback } from "react";
import "./footer.css";

export default function Footer() {
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

  return (
    <footer id="cc-footer" className="cc-footer">
      <div className="footer-glass">

        <div className="footer-icons" id="footer-icons">
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
