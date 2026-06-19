/* ============================================================
   CROWN CREATIVES — HERO GALLERY (Stable Modular Version)
   Loads manifest → builds lanes → starts rotation
============================================================ */

(function () {

  const manifestURL = "/assets/images/gallery/manifest.json";
  let IMAGES = [];
  let leftLane, rightLane;
  let rotationStarted = false;

  async function loadManifest() {
    const res = await fetch(manifestURL);
    if (!res.ok) throw new Error("Gallery manifest missing");
    return await res.json();
  }

  function buildLanes(images) {
    leftLane = document.querySelector(".gallery-left .gallery-lane-inner");
    rightLane = document.querySelector(".gallery-right .gallery-lane-inner");

    if (!leftLane || !rightLane) {
      console.error("Hero gallery containers missing.");
      return false;
    }

    leftLane.innerHTML = "";
    rightLane.innerHTML = "";

    images.forEach((name, i) => {
      const img = document.createElement("img");
      img.src = `/assets/images/gallery/${name}`;
      img.loading = "lazy";
      img.className = "gallery-image";

      if (i % 2 === 0) leftLane.appendChild(img);
      else rightLane.appendChild(img);
    });

    return true;
  }

  function startRotation() {
    if (rotationStarted) return;
    rotationStarted = true;

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

  window.initHeroGallery = async function () {
    try {
      IMAGES = await loadManifest();
      if (!IMAGES.length) {
        console.warn("Hero gallery: no images found.");
        return;
      }

      if (!buildLanes(IMAGES)) return;

      startRotation();
      console.log("Hero gallery initialised.");
    } catch (e) {
      console.error("Hero gallery failed:", e);
    }
  };

})();
