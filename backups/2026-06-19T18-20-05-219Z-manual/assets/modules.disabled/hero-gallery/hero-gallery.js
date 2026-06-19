setTimeout(async () => {
  const leftLane = document.querySelector(".gallery-left .gallery-lane-inner");
  const rightLane = document.querySelector(".gallery-right .gallery-lane-inner");

  if (!leftLane) return;

  const images = await loadManifest();
  if (!images.length) return;

  function createLayers(container) {
    const a = document.createElement("div");
    const b = document.createElement("div");
    a.className = "gallery-image active";
    b.className = "gallery-image";
    container.appendChild(a);
    container.appendChild(b);
    return [a, b];
  }

  const [leftA, leftB] = createLayers(leftLane);
  const leftState = { current: null, toggle: true };
  crossfade(leftA, leftB, leftState, images);
  setInterval(() => crossfade(leftA, leftB, leftState, images), 10000);

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (!isMobile && rightLane) {
    const [rightA, rightB] = createLayers(rightLane);
    const rightState = { current: null, toggle: true };
    crossfade(rightA, rightB, rightState, images);
    setInterval(() => crossfade(rightA, rightB, rightState, images), 10000);
  }
}, 50);
