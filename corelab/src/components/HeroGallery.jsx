// ============================================================
// HeroGallery.jsx — Draggable, Snapping, Persistent Dual-Lane Gallery (GR1 Stable)
// Crown Creatives Editor OS Integration
// ============================================================

import { useEffect, useState, useRef } from "react";
import { loadGallery } from "../gallery/GalleryEngine.js";
import { runGallerySentinel } from "../sentinel/GallerySentinel.js";
import { useAdmin } from "../admin/AdminContext.jsx";

export default function HeroGallery() {
  const { isAdmin, isPaused } = useAdmin(); // ⭐ Global Admin OS state

  const [images, setImages] = useState([]);

  const leftLaneRef = useRef(null);
  const rightLaneRef = useRef(null);

  // ------------------------------------------------------------
  // LOAD SAVED POSITIONS SAFELY
  // ------------------------------------------------------------
  useEffect(() => {
    try {
      const leftPos = JSON.parse(localStorage.getItem("lane-left-pos") || "null");
      const rightPos = JSON.parse(localStorage.getItem("lane-right-pos") || "null");

      if (leftPos && leftLaneRef.current) {
        leftLaneRef.current.style.left = leftPos.left;
        leftLaneRef.current.style.top = leftPos.top;
      }

      if (rightPos && rightLaneRef.current) {
        rightLaneRef.current.style.left = rightPos.left;
        rightLaneRef.current.style.top = rightPos.top;
      }
    } catch (err) {
      console.warn("Gallery lane position load failed:", err);
    }
  }, []);

  // ------------------------------------------------------------
  // DRAG LOGIC WITH SNAPPING + LOCALSTORAGE (SAFE)
  // ------------------------------------------------------------
  function makeDraggable(ref, storageKey) {
    let pos = { x: 0, y: 0 };

    function onMouseDown(e) {
      if (!isAdmin) return; // ⭐ Only draggable in Admin Mode
      e.preventDefault();

      pos.x = e.clientX;
      pos.y = e.clientY;

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }

    function onMouseMove(e) {
      try {
        const el = ref.current;
        if (!el) return;

        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        pos.x = e.clientX;
        pos.y = e.clientY;

        let newLeft = el.offsetLeft + dx;
        let newTop = el.offsetTop + dy;

        const snapDistance = 20;

        // Snap left
        if (Math.abs(newLeft) < snapDistance) newLeft = 0;

        // Snap right
        const rightEdge = window.innerWidth - el.offsetWidth;
        if (Math.abs(newLeft - rightEdge) < snapDistance) newLeft = rightEdge;

        // Snap center
        const center = (window.innerWidth - el.offsetWidth) / 2;
        if (Math.abs(newLeft - center) < snapDistance) newLeft = center;

        // Snap vertical increments
        newTop = Math.round(newTop / snapDistance) * snapDistance;

        el.style.left = `${newLeft}px`;
        el.style.top = `${newTop}px`;
      } catch (err) {
        console.warn("Gallery drag move failed:", err);
      }
    }

    function onMouseUp() {
      try {
        const el = ref.current;
        if (!el) return;

        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        localStorage.setItem(
          storageKey,
          JSON.stringify({
            left: el.style.left,
            top: el.style.top
          })
        );
      } catch (err) {
        console.warn("Gallery drag save failed:", err);
      }
    }

    if (ref.current) {
      ref.current.addEventListener("mousedown", onMouseDown);
    }
  }

  // ------------------------------------------------------------
  // ENABLE DRAGGING WHEN ADMIN MODE ACTIVATES
  // ------------------------------------------------------------
  useEffect(() => {
    try {
      if (isAdmin) {
        document.body.classList.add("gallery-edit-mode");
        makeDraggable(leftLaneRef, "lane-left-pos");
        makeDraggable(rightLaneRef, "lane-right-pos");
      } else {
        document.body.classList.remove("gallery-edit-mode");
      }
    } catch (err) {
      console.warn("Gallery admin mode failed:", err);
    }
  }, [isAdmin]);

  // ------------------------------------------------------------
  // INITIAL LOAD: Sentinel + Gallery Manifest
  // ------------------------------------------------------------
  useEffect(() => {
    async function init() {
      try {
        const sentinelReport = await runGallerySentinel();
        console.log("[HeroGallery] Sentinel report:", sentinelReport);

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

  // ------------------------------------------------------------
  // MAGICAL ALTERNATING LANE LOGIC (PAUSES IN ADMIN MODE)
  // ------------------------------------------------------------
  useEffect(() => {
    if (!images.length) return;

    let index = 0;
    let showLeft = true;

    const leftImg = document.querySelector(".hero-gallery-left img");
    const rightImg = document.querySelector(".hero-gallery-right img");

    if (leftImg && rightImg) {
      leftImg.src = images[index];
      rightImg.src = images[(index + 1) % images.length];

      leftImg.classList.add("visible");
      rightImg.classList.remove("visible");
    }

    const interval = setInterval(() => {
      try {
        if (isPaused) return;

        index = (index + 1) % images.length;

        if (showLeft) {
          rightImg?.classList.remove("visible");
          leftImg.src = images[index];
          leftImg?.classList.add("visible");
        } else {
          leftImg?.classList.remove("visible");
          rightImg.src = images[index];
          rightImg?.classList.add("visible");
        }

        showLeft = !showLeft;
      } catch (err) {
        console.warn("Gallery interval failed:", err);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [images, isPaused]);

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

      {/* LEFT LANE — DRAGGABLE */}
      <div ref={leftLaneRef} className="hero-gallery-lane hero-gallery-left">
        <img className="hero-gallery-img" src={left} alt="Gallery Left" />
      </div>

      {/* RIGHT LANE — DRAGGABLE */}
      <div ref={rightLaneRef} className="hero-gallery-lane hero-gallery-right">
        <img className="hero-gallery-img" src={right} alt="Gallery Right" />
      </div>

      {/* GLOW OVERLAY */}
      <div className="hero-gallery-glow-overlay">
        <div className="hero-gallery-glow-left"></div>
        <div className="hero-gallery-glow-right"></div>
      </div>
    </div>
  );
}
