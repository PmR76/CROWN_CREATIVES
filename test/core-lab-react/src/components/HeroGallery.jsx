import { useEffect } from "react";
import { initHeroGallery } from "../shared/heroGalleryEngine";
import "../shared/hero-gallery.css";

export default function HeroGallery() {
  useEffect(() => {
    initHeroGallery(document);
  }, []);

  return (
    <>
    <div className="hero-gallery-container">
  <div className="hero-gallery-left">
    <img className="hero-gallery-img" />
  </div>

  <div className="hero-gallery-right">
    <img className="hero-gallery-img" />
  </div>
</div>


      <div className="hero-gallery-glow-overlay">
        <div className="hero-gallery-glow-left"></div>
        <div className="hero-gallery-glow-right"></div>
      </div>
    </>
  );
}
