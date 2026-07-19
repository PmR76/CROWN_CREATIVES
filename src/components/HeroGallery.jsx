// ============================================================
// HeroGallery.jsx — Draggable, Snapping, Persistent Dual-Lane Gallery
// Crown Creatives Editor OS Integration
// ============================================================

import { useEffect, useState, useRef } from "react";
import { loadGallery } from "../gallery/GalleryEngine";
import { runGallerySentinel } from "../sentinel/GallerySentinel";
import { useAdmin } from "../admin/AdminContext";

export default function HeroGallery() {
  const { isAdmin, isPaused } = useAdmin();   // ⭐ Global Admin OS state
  const [images, setImages] = useState([]);

  const leftLaneRef = useRef(null);
  const rightLaneRef = useRef(null);

  // ------------------------------------------------------------
  // LOAD SAVED POSITIONS
  // ------------------------------------------------------------
  useEffect(() => {
    const leftPos = JSON.parse(localStorage.getItem("lane-left-pos"));
    const rightPos = JSON.parse(localStorage.getItem("lane-right-pos"));

    if (leftPos && leftLaneRef.current) {
      leftLaneRef.current.style.left = leftPos.left;
      leftLaneRef.current.style.top = leftPos.top;
    }

    if (rightPos && rightLaneRef.current) {
      rightLaneRef.current.style.left = rightPos.left;
      rightLaneRef.current.style.top = rightPos.top;
    }
  }, []);

  // ------------------------------------------------------------
  // DRAG LOGIC WITH SNAPPING + LOCALSTORAGE
  // ------------------------------------------------------------
  function makeDraggable(ref, storageKey) {
    let pos = { x: 0, y: 0 };

    function onMouseDown(e) {
      if (!isAdmin) return;  // ⭐ Only draggable in Admin Mode
      e.preventDefault();

      pos.x = e.clientX;
      pos.y = e.clientY;

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }

    function onMouseMove(e) {
      const dx = e.clientX - pos.x;
      const dy = e.clientY - pos.y;

      pos.x = e.clientX;
      pos.y = e.clientY;

      const el = ref.current;
      let newLeft = el.offsetLeft + dx;
      let newTop = el.offsetTop + dy;

      // ⭐ Snapping guides
      const snapDistance = 20;

      // Snap to left edge
      if (Math.abs(newLeft) < snapDistance) newLeft = 0;

      // Snap to right edge
      const rightEdge = window.innerWidth - el.offsetWidth;
      if (Math.abs(newLeft - rightEdge) < snapDistance) newLeft = rightEdge;

      // Snap to center
      const center = (window.innerWidth - el.offsetWidth) / 2;
      if (Math.abs(newLeft - center) < snapDistance) newLeft = center;

      // Snap vertical increments
      newTop = Math.round(newTop / snapDistance) * snapDistance;

      el.style.left = newLeft + "px";
      el.style.top = newTop + "px";
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      const el = ref.current;
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          left: el.style.left,
          top: el.style.top,
        })
      );
    }

    if (ref.current) {
      ref.current.addEventListener("mousedown", onMouseDown);
    }
  }

  // ------------------------------------------------------------
  // ENABLE DRAGGING WHEN ADMIN MODE ACTIVATES
  // ------------------------------------------------------------
  useEffect(() => {
    if (isAdmin) {
      document.body.classList.add("gallery-edit-mode");
      makeDraggable(leftLaneRef, "lane-left-pos");
      makeDraggable(rightLaneRef, "lane-right-pos");
    } else {
      document.body.classList.remove("gallery-edit-mode");
    }
  }, [isAdmin]);

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
          setImages(["/assets/images/fallback.jpeg"]);
        } else {
          setImages(loaded);
        }
      } catch (err) {
        setImages(["/assets/images/fallback.jpeg"]);
      }
    }

    init();
  }, []);

  // ------------------------------------------------------------
  // MAGICAL ALTERNATING LANE LOGIC (PAUSES IN ADMIN MODE)
  // ------------------------------------------------------------
  useEffect(() => {
    if (images.length === 0) return;

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
      if (isPaused) return;  // ⭐ Pause everything in Admin Mode

      index = (index + 1) % images.length;

      if (showLeft) {
        rightImg.classList.remove("visible");
        leftImg.src = images[index];
        leftImg.classList.add("visible");
      } else {
        leftImg.classList.remove("visible");
        rightImg.src = images[index];
        rightImg.classList.add("visible");
      }

      showLeft = !showLeft;
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
        <img className="hero-gallery-img" src={left} />
      </div>

      {/* RIGHT LANE — DRAGGABLE */}
      <div ref={rightLaneRef} className="hero-gallery-lane hero-gallery-right">
        <img className="hero-gallery-img" src={right} />
      </div>

      {/* GLOW OVERLAY */}
      <div className="hero-gallery-glow-overlay">
        <div className="hero-gallery-glow-left"></div>
        <div className="hero-gallery-glow-right"></div>
      </div>
    </div>
  );
}
