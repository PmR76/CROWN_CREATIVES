import "./header.css";

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

      {/* LEFT: SOUND TOGGLE */}
      <div className="cc-header-left">
        <button id="soundToggle" className="cc-toggle" onClick={toggleSound}>
          <img src="/assets/icons/music.png" alt="Sound Toggle" />
        </button>
      </div>

      {/* CENTER: LOGO + TITLE + TAGLINE + NAV */}
      <div className="cc-header-center">
        <a href="/index.html" className="cc-logo-link">
          <img
            src="/assets/icons/head-crown.svg"
            className="cc-header-crown"
            alt="Crown Creatives Logo"
          />
        </a>

        <h1 className="cc-header-title">Crown Creatives</h1>
        <div className="cc-header-tagline">Artistry • Resilience • Imagination</div>

        <nav className="cc-header-nav">
          <a href="/index.html">Home</a>
          <a href="/about.html">About</a>
          <a href="/gallery.html">Gallery</a>
          <a href="/projects.html">Projects</a>
          <a href="/videos.html">Videos</a>
          <a href="/podcasts.html">Podcasts</a>
          <a href="/blog.html">Blog</a>
          <a href="/contact.html">Contact</a>
        </nav>
      </div>

      {/* RIGHT: THEME TOGGLE */}
      <div className="cc-header-right">
        <button id="themeToggle" className="cc-toggle" onClick={toggleTheme}>
          <img src="/assets/icons/sun-moon.png" alt="Theme Toggle" />
        </button>
      </div>

    </header>
  );
}
