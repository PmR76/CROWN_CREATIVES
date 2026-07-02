import "../styles/header.css";

export default function Header() {
  const toggleSound = () => {
    const event = new CustomEvent("cc-toggle-sound");
    window.dispatchEvent(event);
  };

  const toggleTheme = () => {
    const event = new CustomEvent("cc-toggle-theme");
    window.dispatchEvent(event);
  };

  return (
    <header className="cc-header">

      <div className="cc-header-left">
        <button id="soundToggle" className="cc-toggle" onClick={toggleSound}>
          <img src="/assets/icons/music.png" alt="Sound Toggle" />
        </button>
      </div>

      <div className="cc-header-center">
        <a href="/" className="cc-logo-link">
          <img
            src="/assets/icons/head-crown.svg"
            className="cc-header-crown"
            alt="Crown Creatives Logo"
          />
        </a>

        <h1 className="cc-header-title">Crown Creatives</h1>
        <div className="cc-header-tagline">Artistry • Resilience • Imagination</div>

        <nav className="cc-header-nav">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/gallery">Gallery</a>
          <a href="/projects">Projects</a>
          <a href="/videos">Videos</a>
          <a href="/podcasts">Podcasts</a>
          <a href="/blog">Blog</a>
          <a href="/contact">Contact</a>
        </nav>
      </div>

      <div className="cc-header-right">
        <button id="themeToggle" className="cc-toggle" onClick={toggleTheme}>
          <img src="/assets/icons/sun-moon.png" alt="Theme Toggle" />
        </button>
      </div>

    </header>
  );
}
