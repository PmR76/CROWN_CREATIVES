// ============================================================
// Home.jsx — Crown Creatives Homepage (Page‑Specific Content Only)
// ============================================================

export default function Home() {
  return (
    <div className="home-page">

      {/* ⭐ PAGE CONTENT ONLY — global elements are in Layout.jsx */}
      <section className="home-intro">
        <h1>Welcome to Crown Creatives</h1>
        <p>Imagination becomes reality.</p>
      </section>

      {/* Add any homepage‑specific sections here */}
      <section className="home-featured">
        <h2>Featured Projects</h2>
        <p>Explore our latest creative work.</p>
      </section>

    </div>
  );
}
