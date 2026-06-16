/* ============================================================
   CROWN CREATIVES — HERO GALLERY (Stable Modular Version)
   Loads manifest → builds lanes → starts rotation
============================================================ */

(function () {

  const manifestURL = "/assets/images/gallery/manifest.json";
  let IMAGES = [];
  let leftLane, rightLane;

  /* ------------------------------------------------------------
     Load manifest (simple + proven)
  ------------------------------------------------------------ */
  async function loadManifest() {
    const res = await fetch(manifestURL);
    if (!res.ok) throw new Error("Gallery manifest missing");
    return await res.json(); // plain array of filenames
  }

  /* ------------------------------------------------------------
     Build gallery lanes
  ------------------------------------------------------------ */
  function buildLanes(images) {
    leftLane = document.querySelector(".gallery-left .gallery-lane-inner");
    rightLane = document.querySelector(".gallery-right .gallery-lane-inner");

    if (!leftLane || !rightLane) {
      console.error("Hero gallery containers missing.");
      return;
    }

    // Clear lanes
    leftLane.innerHTML = "";
    rightLane.innerHTML = "";

    // Fill lanes
    images.forEach((name, i) => {
      const img = document.createElement("img");
      img.src = `/assets/images/gallery/${name}`;
      img.loading = "lazy";

      if (i % 2 === 0) {
        leftLane.appendChild(img);
      } else {
        rightLane.appendChild(img);
      }
    });
  }

  /* ------------------------------------------------------------
     Simple rotation (fade + swap)
  ------------------------------------------------------------ */
  function startRotation() {
    const allLeft = leftLane.querySelectorAll("img");
    const allRight = rightLane.querySelectorAll("img");

    let index = 0;

    setInterval(() => {
      allLeft.forEach(img => img.style.opacity = "0.2");
      allRight.forEach(img => img.style.opacity = "0.2");

      if (allLeft[index]) allLeft[index].style.opacity = "1";
      if (allRight[index]) allRight[index].style.opacity = "1";

      index = (index + 1) % Math.max(allLeft.length, allRight.length);
    }, 3000);
  }

  /* ------------------------------------------------------------
     INIT — safe, stable, DOM-ready
  ------------------------------------------------------------ */
  window.initHeroGallery = async function () {
    try {
      IMAGES = await loadManifest();
      buildLanes(IMAGES);
      startRotation();
      console.log("Hero gallery initialised.");
    } catch (e) {
      console.error("Hero gallery failed:", e);
    }
  };

})();
