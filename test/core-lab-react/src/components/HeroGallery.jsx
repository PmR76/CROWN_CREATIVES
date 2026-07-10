// C:\DEV\CROWN_CREATIVES\test\core-lab-react\src\components\HeroGallery.jsx

import { useEffect, useState } from "react";
import { loadGallery } from "../gallery/GalleryEngine";
import { runGallerySentinel } from "../sentinel/GallerySentinel";

export default function HeroGallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function init() {
      // Run sentinel first for diagnostics
      const sentinelReport = await runGallerySentinel();
      console.log("[HeroGallery] Sentinel report:", sentinelReport);

      try {
        const loaded = await loadGallery();

        if (!loaded || loaded.length === 0) {
          console.warn("[HeroGallery] loadGallery returned empty array.");
          setImages(["/assets/images/fallback.jpeg"]);
        } else {
          setImages(loaded);
        }
      } catch (err) {
        console.warn("[HeroGallery] Gallery load failed:", err);
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
