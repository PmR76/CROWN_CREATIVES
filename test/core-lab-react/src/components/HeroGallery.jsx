// C:\DEV\CROWN_CREATIVES\test\core-lab-react\src\components\HeroGallery.jsx

import { useEffect, useState } from "react";
import { loadGallery } from "../gallery/GalleryEngine";
import { runGallerySentinel } from "../sentinel/GallerySentinel";

export default function HeroGallery() {
  const [images, setImages] = useState([]);

  // ------------------------------------------------------------
  // INITIAL LOAD: Sentinel + Gallery Manifest
  // ------------------------------------------------------------
  useEffect(() => {
    async function init() {
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

  // ------------------------------------------------------------
  // MAGICAL ALTERNATING LANE LOGIC
  // ------------------------------------------------------------
  useEffect(() => {
    if (images.length === 0) return;

    let index = 0;
    let showLeft = true;

    const leftImg = document.querySelector(".hero-gallery-left img");
    const rightImg = document.querySelector(".hero-gallery-right img");

    // Initial state
    if (leftImg && rightImg) {
      leftImg.src = images[index];
      rightImg.src = images[(index + 1) % images.length];

      leftImg.classList.add("visible");
      rightImg.classList.remove("visible");
    }

    const interval = setInterval(() => {
      index = (index + 1) % images.length;

      if (showLeft) {
        // Fade out right, fade in left
        rightImg.classList.remove("visible");
        leftImg.src = images[index];
        leftImg.classList.add("visible");
      } else {
        // Fade out left, fade in right
        leftImg.classList.remove("visible");
        rightImg.src = images[index];
        rightImg.classList.add("visible");
      }

      showLeft = !showLeft;
    }, 8000); // 8 seconds hold time

    return () => clearInterval(interval);
  }, [images]);

  // ------------------------------------------------------------
  // INITIAL IMAGE SELECTION
  // ------------------------------------------------------------
  const left = images[0] || "/assets/images/fallback.jpeg";
  const right = images[1] || left;

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
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
