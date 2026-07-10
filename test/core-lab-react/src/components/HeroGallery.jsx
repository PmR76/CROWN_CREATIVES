// ============================================================
// HeroGallery.jsx — Cinematic Dual-Lane Gallery (Manifest-Based)
// ============================================================

import { useEffect, useState } from "react";
import { loadGallery } from "../gallery/GalleryEngine";

export default function HeroGallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function init() {
      try {
        const loaded = await loadGallery();

        if (!loaded || loaded.length === 0) {
          setImages(["/assets/images/fallback.jpeg"]);
        } else {
          setImages(loaded);
        }
      } catch (err) {
        console.warn("Gallery load failed:", err);
        setImages(["/assets/images/fallback.jpeg"]);
      }
    }

    init();
  }, []);

  const left = images[0] || "/assets/images/fallback.jpeg";
  const right = images[1] || left;

  return (
    <div className="hero-gallery-container">
      <div className="hero-gallery-lane hero-gallery-left">
        <img className="hero-gallery-img" src={left} />
      </div>

      <div className="hero-gallery-lane hero-gallery-right">
        <img className="hero-gallery-img" src={right} />
      </div>

      <div className="hero-gallery-glow-overlay">
        <div className="hero-gallery-glow-left"></div>
        <div className="hero-gallery-glow-right"></div>
      </div>
    </div>
  );
}
