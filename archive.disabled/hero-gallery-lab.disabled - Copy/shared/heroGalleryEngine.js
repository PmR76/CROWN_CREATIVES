// HERO GALLERY ENGINE — shared between React + Lab

const MANIFEST_URL = "/assets/images/gallery/gallery-manifest.json";
const BASE_PATH = "/assets/images/gallery/";
const FALLBACK = "/assets/images/fallback.jpg";

export function initHeroGallery(root = document, options = {}) {
  const leftImg = root.querySelector(".hero-gallery-left .hero-gallery-img");
  const rightImg = root.querySelector(".hero-gallery-right .hero-gallery-img");

  if (!leftImg || !rightImg) {
    console.warn("HeroGalleryEngine: missing lane images.");
    return;
  }

  let images = [];
  let index = 0;
  let lane = "left";
  let intervalMs = options.intervalMs || 6000;
  let timer = null;
  let isPaused = false;
  let shuffle = false;
  let lastManifestHash = null;

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
        }
      })
      .catch(err => {
        console.error("Manifest load error:", err);
      });
  }

  function fadeIn(img, src) {
    img.classList.remove("visible");

    setTimeout(() => {
      img.onerror = () => {
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

  // initial load
  loadManifest().then(() => {
    if (images.length === 0) {
      console.warn("HeroGalleryEngine: no valid images.");
      return;
    }
    cycle();
    startLoop();
  });

  return {
    pause() { isPaused = true; },
    resume() { isPaused = false; },
    next() { cycle(); },
    prev() {
      index = (index - 2 + images.length) % images.length;
      cycle();
    },
    setSpeed(ms) {
      intervalMs = ms;
      startLoop();
    },
    enableShuffle(on) {
      shuffle = !!on;
    }
  };
}
