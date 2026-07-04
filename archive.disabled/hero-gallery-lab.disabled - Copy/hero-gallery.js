/* ============================================================
   HERO GALLERY — DUAL-LANE + E-UPDATE
   Manifest + Fade Engine + Admin Overlay + Auto-Refresh + Glow
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  console.log("Hero Gallery JS Loaded:", new Date().toLocaleString());

  /* ------------------------------------------------------------
     ELEMENTS
  ------------------------------------------------------------ */
  const leftImg = document.querySelector(".hero-gallery-left .hero-gallery-img");
  const rightImg = document.querySelector(".hero-gallery-right .hero-gallery-img");

  if (!leftImg || !rightImg) {
    console.warn("Hero Gallery: Missing lane images.");
    return;
  }

  const adminPanel = document.getElementById("gallery-admin");
  const speedSlider = document.getElementById("gallery-speed");
  const speedLabel = document.getElementById("gallery-speed-label");
  const refreshBtn = document.getElementById("gallery-refresh");
  const toastEl = document.getElementById("gallery-toast");
  const toastText = document.getElementById("gallery-toast-text");
  const closeAdminBtn = document.getElementById("gallery-admin-close");

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
  let lastManifestHash = null;

  const isLab = window.location.pathname.includes("hero-gallery-lab");

  /* ------------------------------------------------------------
     TOAST
  ------------------------------------------------------------ */
  function showToast(msg) {
    if (!toastEl || !toastText) return;
    toastText.textContent = msg;
    toastEl.classList.remove("gallery-toast-hidden");

    setTimeout(() => {
      toastEl.classList.add("gallery-toast-hidden");
    }, 2500);
  }

  /* ------------------------------------------------------------
     MANIFEST LOADING + HASHING
  ------------------------------------------------------------ */
  function hashList(arr) {
    return arr.join("|");
  }

  function loadManifest(showMessages = false) {
    return fetch(MANIFEST_URL + "?t=" + Date.now())
      .then(r => {
        if (!r.ok) throw new Error("Manifest fetch failed");
        return r.json();
      })
      .then(files => {
        const valid = files.filter(f =>
          typeof f === "string" &&
          f.match(/\.(jpg|jpeg|png|webp|gif)$/i)
        );

        const fullPaths = valid.map(f => BASE_PATH + f);
        const newHash = hashList(fullPaths);

        if (newHash !== lastManifestHash) {
          lastManifestHash = newHash;
          images = fullPaths;
          index = 0;
          lane = "left";
          cycle();
          startLoop();
          if (showMessages) showToast("Gallery updated.");
        } else if (showMessages) {
          showToast("No changes in manifest.");
        }
      })
      .catch(err => {
        console.error("Manifest load error:", err);
        if (showMessages) showToast("Failed to refresh manifest.");
      });
  }

  /* ------------------------------------------------------------
     EFFECT HELPERS
  ------------------------------------------------------------ */
  function fadeIn(img, src) {
    img.classList.remove("visible");

    setTimeout(() => {
      img.onerror = () => {
        console.warn("Image failed:", src, "→ fallback");
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
    return shuffle
      ? Math.floor(Math.random() * images.length)
      : (index + 1) % images.length;
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
     ADMIN PANEL
  ------------------------------------------------------------ */
  function initAdminPanel() {
    if (!adminPanel) return;

    // LAB MODE: always visible
    if (isLab) {
      adminPanel.classList.remove("gallery-admin-hidden");
    }

    // Shift + A toggle (homepage only)
    window.addEventListener("keydown", e => {
      if (e.shiftKey && e.key.toLowerCase() === "a" && !isLab) {
        adminPanel.classList.toggle("gallery-admin-hidden");
      }
    });

    // Close button
    if (closeAdminBtn) {
      closeAdminBtn.addEventListener("click", () => {
        adminPanel.classList.add("gallery-admin-hidden");
      });
    }

    // Buttons
    adminPanel.addEventListener("click", e => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const action = btn.dataset.action;

      if (action === "pause") {
        isPaused = !isPaused;
        btn.textContent = isPaused ? "Resume" : "Pause";
      }

      if (action === "next") cycle();
      if (action === "prev") {
        index = (index - 2 + images.length) % images.length;
        cycle();
      }

      if (action === "shuffle") {
        shuffle = !shuffle;
        btn.textContent = `Shuffle: ${shuffle ? "On" : "Off"}`;
      }
    });

    // Speed slider
    if (speedSlider) {
      speedSlider.addEventListener("input", () => {
        intervalMs = Number(speedSlider.value);
        speedLabel.textContent = (intervalMs / 1000) + "s";
        startLoop();
      });
    }

    // Manual refresh
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        loadManifest(true);
      });
    }
  }

  /* ------------------------------------------------------------
     AUTO-POLL MANIFEST (every 15s)
  ------------------------------------------------------------ */
  function startAutoRefresh() {
    setInterval(() => {
      loadManifest(false);
    }, 15000);
  }

  /* ------------------------------------------------------------
     THEME GLOW
  ------------------------------------------------------------ */
  document.addEventListener("theme-changed", e => {
    const theme = e.detail;

    if (theme === "dark") {
      leftImg.style.filter = "drop-shadow(0 0 18px rgba(120,200,255,0.7))";
      rightImg.style.filter = "drop-shadow(0 0 18px rgba(120,200,255,0.7))";
    } else {
      leftImg.style.filter = "drop-shadow(0 0 16px rgba(255,210,150,0.7))";
      rightImg.style.filter = "drop-shadow(0 0 16px rgba(255,210,150,0.7))";
    }
  });

  /* ------------------------------------------------------------
     INIT
  ------------------------------------------------------------ */
  loadManifest().then(() => {
    if (images.length === 0) {
      console.warn("Hero Gallery: No valid images.");
      return;
    }

    initAdminPanel();
    cycle();
    startLoop();
    startAutoRefresh();
  });

});
