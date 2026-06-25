/* ============================================================
   HERO GALLERY — MANIFEST + FADE ENGINE + ADMIN + EFFECTS
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  console.log("Hero Gallery JS Loaded:", new Date().toLocaleString());

  const leftImg = document.querySelector(".hero-gallery-left .hero-gallery-img");
  const rightImg = document.querySelector(".hero-gallery-right .hero-gallery-img");

  if (!leftImg || !rightImg) {
    console.warn("Hero Gallery: Missing lane images.");
    return;
  }

  /* ------------------------------------------------------------
     CONFIG
  ------------------------------------------------------------ */
  const MANIFEST_URL = "/assets/images/gallery/gallery-manifest.json";
  const BASE_PATH = "/assets/images/gallery/";
  const FALLBACK = "/assets/images/fallback.jpg";

  let images = [];
  let index = 0;
  let lane = "left";
  let intervalMs = 6000;
  let timer = null;
  let isPaused = false;
  let shuffle = false;

  /* ------------------------------------------------------------
     LOAD MANIFEST
  ------------------------------------------------------------ */

  function loadManifest() {
    return fetch(MANIFEST_URL)
      .then(r => {
        if (!r.ok) {
          console.warn("Gallery manifest missing or unreadable.");
          return null;
        }
        return r.json();
      })
      .then(files => {
        if (!files) return [];

        const valid = files.filter(f =>
          typeof f === "string" &&
          f.match(/\.(jpg|jpeg|png|webp|gif)$/i)
        );

        return valid.map(f => BASE_PATH + f);
      })
      .catch(err => {
        console.error("Gallery manifest load error:", err);
        return [];
      });
  }

  /* ------------------------------------------------------------
     EFFECT HELPERS
  ------------------------------------------------------------ */

  function fadeIn(img, src) {
    img.classList.remove("visible", "dof-strong");

    setTimeout(() => {
      img.onerror = () => {
        console.warn("Gallery image failed:", src, "→ fallback");
        img.src = FALLBACK;
        img.classList.add("visible");
      };

      img.onload = () => {
        img.classList.add("visible");
      };

      img.src = src;
    }, 50);
  }

  function fadeOut(img) {
    img.classList.remove("visible");
  }

  function nextIndex() {
    if (shuffle) {
      return Math.floor(Math.random() * images.length);
    }
    return (index + 1) % images.length;
  }

  /* ------------------------------------------------------------
     MAIN CYCLE
  ------------------------------------------------------------ */

  function cycle() {
    if (isPaused || images.length === 0) return;

    const src = images[index];

    if (lane === "left") {
      fadeOut(rightImg);
      fadeIn(leftImg, src);
      lane = "right";
    } else {
      fadeOut(leftImg);
      fadeIn(rightImg, src);
      lane = "left";
    }

    index = nextIndex();
  }

  function startLoop() {
    if (timer) clearInterval(timer);
    timer = setInterval(cycle, intervalMs);
  }

  /* ------------------------------------------------------------
     ADMIN PANEL (LAB + HOMEPAGE)
  ------------------------------------------------------------ */

  function createAdminPanel() {
    const panel = document.createElement("div");
    panel.id = "gallery-admin";

    panel.innerHTML = `
      <span>Gallery:</span>
      <button data-action="prev">Prev</button>
      <button data-action="next">Next</button>
      <button data-action="pause">Pause</button>
      <button data-action="shuffle">Shuffle: Off</button>
      <label>Speed
        <input type="range" min="3000" max="15000" step="1000" value="${intervalMs}">
      </label>
    `;

    document.body.appendChild(panel);

    /* LAB MODE: always visible */
    const isLab = window.location.pathname.includes("hero-gallery-lab");
    if (!isLab) {
      panel.classList.add("hidden");
    }

    /* Shift + A toggle (homepage only) */
    window.addEventListener("keydown", e => {
      if (e.key === "A" && e.shiftKey && !isLab) {
        panel.classList.toggle("hidden");
      }
    });

    /* Button actions */
    panel.addEventListener("click", e => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const action = btn.dataset.action;

      if (action === "pause") {
        isPaused = !isPaused;
        btn.textContent = isPaused ? "Resume" : "Pause";
      }

      if (action === "next") {
        cycle();
      }

      if (action === "prev") {
        index = (index - 2 + images.length) % images.length;
        cycle();
      }

      if (action === "shuffle") {
        shuffle = !shuffle;
        btn.textContent = `Shuffle: ${shuffle ? "On" : "Off"}`;
      }
    });

    /* Speed control */
    const range = panel.querySelector('input[type="range"]');
    range.addEventListener("input", () => {
      intervalMs = Number(range.value);
      startLoop();
    });
  }

  /* ------------------------------------------------------------
     THEME-REACTIVE GLOW HOOK
  ------------------------------------------------------------ */

  document.addEventListener("theme-changed", e => {
    const theme = e.detail;

    if (theme === "dark") {
      leftImg.style.filter = "drop-shadow(0 0 18px rgba(120,200,255,0.7)) blur(0.5px)";
      rightImg.style.filter = "drop-shadow(0 0 18px rgba(120,200,255,0.7)) blur(0.5px)";
    } else {
      leftImg.style.filter = "drop-shadow(0 0 16px rgba(255,210,150,0.7)) blur(0.5px)";
      rightImg.style.filter = "drop-shadow(0 0 16px rgba(255,210,150,0.7)) blur(0.5px)";
    }
  });

  /* ------------------------------------------------------------
     INIT
  ------------------------------------------------------------ */

  loadManifest().then(list => {
    images = list;

    if (images.length === 0) {
      console.warn("Hero Gallery: Manifest contains no valid images.");
      return;
    }

    index = 0;
    lane = "left";

    createAdminPanel();
    cycle();
    startLoop();
  });

});
