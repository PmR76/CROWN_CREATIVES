import "./../styles/footer.css";

export default function Footer() {
  return (
    <footer id="cc-footer" className="cc-footer">
      <div className="footer-glass">

        <div className="footer-icons" id="footer-icons">
          <img src="/icons/facebook.svg" className="footer-icon" data-id="facebook" />
          <img src="/icons/instagram.svg" className="footer-icon" data-id="instagram" />
          <img src="/icons/email.svg" className="footer-icon" data-id="email" />
          <img src="/icons/copilot.svg" className="footer-icon" data-id="copilot" />
        </div>

        <button id="back-to-top" className="back-to-top">▲</button>

        <div className="footer-copy">
          © 2026 Crown Creatives — All Rights Reserved<br />
          Royalty‑Free Music Provided by Pixabay
        </div>

      </div>
    </footer>
  );
}
