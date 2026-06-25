/* ============================================================
   HERO GALLERY — AUTO-SCAN + FADE ENGINE
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------------------------------------
     RUN ONLY ON HOMEPAGE
  ------------------------------------------------------------ */
  if (!window.location.pathname.includes("hero-gallery-lab") &&
      !window.location.pathname.endsWith("/") &&
      !window.location.pathname.includes("index")) {
    console.log("Hero Gallery: Not homepage, skipping.");
    return;
  }

  console.log("Hero Gallery JS Loaded:", new Date().toLocaleString());

  /* ------------------------------------------------------------
     GALLERY LANES
  ------------------------------------------------------------ */
  const leftImg = document.querySelector(".hero-gallery-left .hero-gallery-img");
  const rightImg = document.querySelector(".hero-gallery-right .hero-gallery-img");

  if (!leftImg || !rightImg) {
    console.warn("Hero Gallery: Missing lane images.");
    return;
  }

  /* ------------------------------------------------------------
     AUTO-SCAN IMAGE FOLDER
     (Assumes images are in /assets/gallery/)
  ------------------------------------------------------------ */

  const galleryPath = "/assets/gallery/";

  // List of supported image types
  const extensions = ["jpg", "jpeg", "png", "webp", "gif"];

  // Build list of possible filenames (001.jpg → 200.jpg)
  const possible = [];
  for (let i = 1; i <= 200; i++) {
    extensions.forEach(ext => possible.push(`${String(i).padStart(3, "0")}.${ext}`));
  }

  // Test which files exist
  async function fileExists(url) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      return res.ok;
    } catch {
      return false;
    }
  }

  async function loadImages() {
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
     FADE ENGINE
  ------------------------------------------------------------ */

  function fadeIn(img, src) {
    img.classList.remove("visible");
    setTimeout(() => {
      img.src = src;
      img.classList.add("visible");
    }, 50);
  }

  function fadeOut(img) {
    img.classList.remove("visible");
  }

  /* ------------------------------------------------------------
     MAIN LOOP — ALTERNATE LEFT → RIGHT
  ------------------------------------------------------------ */

  loadImages().then(images => {

    if (images.length === 0) {
      console.warn("Hero Gallery: No images found in /assets/gallery/");
      return;
    }

    let index = 0;
    let lane = "left";

    function cycle() {
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

      index = (index + 1) % images.length;
    }

    // Start immediately
    cycle();

    // Repeat every 6 seconds
    setInterval(cycle, 6000);
  });

});
