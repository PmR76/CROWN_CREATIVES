import Header from "../components/Header";
import Ticker from "../components/Ticker";
import Footer from "../components/Footer";

import "../styles/header.css";
import "../styles/ticker.css";
import "../styles/footer.css";
import "../styles/about.css"; // new stylesheet for About page

export default function About() {
  return (
    <main className="about-page">

      {/* Global Header */}
      <Header />

      {/* Page Content */}
      <section className="about-section">
        <h1>About Crown Creatives</h1>
        <p>
          Crown Creatives is built on imagination, resilience, and the power of artistic expression.
          This space celebrates creativity in all its forms — design, storytelling, craft, and innovation.
        </p>
        <p>
          The project blends design, technology, and community to create a cinematic, OS‑like experience
          where creativity becomes interactive.
        </p>
      </section>

      {/* Global Ticker */}
      <Ticker />

      {/* Global Footer */}
      <Footer />

    </main>
  );
}
