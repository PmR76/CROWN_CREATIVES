/* ============================================================
   HERO GALLERY — AUTO-SCAN + EFFECTS + ADMIN
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
  const galleryPath = "/assets/images/gallery/";
  const extensions = ["jpg", "jpeg", "png", "webp", "gif"];

  let images = [];
  let index = 0;
  let lane = "left";
  let intervalMs = 6000;
  let timer = null;
  let isPaused = false;
  let shuffle = false;

  /* ------------------------------------------------------------
     FILE DISCOVERY
  ------------------------------------------------------------ */

  async function fileExists(url) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      return res.ok;
    } catch {
      return false;
    }
  }

  async function loadImages() {
    const possible = [];
    for (let i = 1; i <= 200; i++) {
      extensions.forEach(ext => possible.push(`${String(i).padStart(3, "0")}.${ext}`));
    }

    const found = [];
    for (const file of possible) {
      const url = galleryPath + file;
      if (await fileExists(url)) {
        found.push(url);
      }
    }
    return found;
  }

  /* ------------------------------------------------------------
     EFFECT HELPERS
  ------------------------------------------------------------ */

  function fadeIn(img, src) {
    img.classList.remove("visible", "dof-strong");
    setTimeout(() => {
      img.src = src;
      img.classList.add("visible");
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

    const imgSrc = images[index];

    if (lane === "left") {
      fadeOut(rightImg);
      fadeIn(leftImg, imgSrc);
      lane = "right";
    } else {
      fadeOut(leftImg);
      fadeIn(rightImg, imgSrc);
      lane = "left";
    }

    index = nextIndex();
  }

  function startLoop() {
    if (timer) clearInterval(timer);
    timer = setInterval(cycle, intervalMs);
  }

  /* ------------------------------------------------------------
     ADMIN PANEL (LAB)
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
        index = (index - 2 + images.length) % images.length; // step back one
        cycle();
      }

      if (action === "shuffle") {
        shuffle = !shuffle;
        btn.textContent = `Shuffle: ${shuffle ? "On" : "Off"}`;
      }
    });

    const range = panel.querySelector('input[type="range"]');
    range.addEventListener("input", () => {
      intervalMs = Number(range.value);
      startLoop();
    });
  }

  /* ------------------------------------------------------------
     THEME-REACTIVE GLOW HOOK (OPTIONAL)
     (If you want gallery images to glow with theme)
  ------------------------------------------------------------ */

  document.addEventListener("theme-changed", e => {
    const theme = e.detail; // "day" or "dark"
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

  loadImages().then(found => {
    images = found;

    if (images.length === 0) {
      console.warn("Hero Gallery: No images found in /assets/images/gallery/");
      return;
    }

    index = 0;
    lane = "left";

    createAdminPanel();
    cycle();
    startLoop();
  });

});
