// ============================================================
// useDiagnostics — Unified Diagnostics Engine
// ============================================================

import { useEffect, useState } from "react";

export function useDiagnostics() {
  const [fps, setFps] = useState(0);
  const [gallery, setGallery] = useState("Missing");
  const [cards, setCards] = useState("Missing");
  const [sentinel, setSentinel] = useState("grey");

  useEffect(() => {
    // FPS LOOP
    let last = performance.now();
    let frames = 0;

    const fpsLoop = () => {
      const now = performance.now();
      frames++;

      if (now - last >= 1000) {
        setFps(frames);
        frames = 0;
        last = now;
      }

      requestAnimationFrame(fpsLoop);
    };

    fpsLoop();

    // GALLERY CHECK
    const galleryCheck = () => {
      const left = document.querySelector(".hero-gallery-left img");
      const right = document.querySelector(".hero-gallery-right img");

      if (left && right) {
        setGallery("Active");
      } else {
        setGallery("Missing");
      }
    };

    // CARDS CHECK
    const cardsCheck = () => {
      const cards = document.querySelectorAll(".card");
      if (cards.length > 0) {
        setCards("Loaded");
      } else {
        setCards("Missing");
      }
    };

    // SENTINEL CHECK
    const sentinelCheck = () => {
      const ok = window.__sentinel_ok;
      setSentinel(ok ? "green" : "grey");
    };

    const interval = setInterval(() => {
      galleryCheck();
      cardsCheck();
      sentinelCheck();
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return { fps, gallery, cards, sentinel };
}
