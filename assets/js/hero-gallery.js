/* ============================================================
   HERO GALLERY — TRUE AUTOSCAN + CINEMATIC MAGIC
   ============================================================ */

const galleryFolder = "/assets/images/gallery/";

async function fetchImages() {
  try {
    const apiURL = `https://api.github.com/repos/pmr76/CROWN_CREATIVES/contents${galleryFolder}`;
    const res = await fetch(apiURL + "?v=" + Date.now());
    const data = await res.json();

    return data
      .filter(item => item.type === "file")
      .map(item => item.name)
      .filter(name => name.match(/\.(jpg|jpeg|png|webp)$/i));
  } catch (err) {
    console.error("Autoscan failed:", err);
    return [];
  }
}

function pickRandom(exclude, list) {
  if (list.length === 1) return list[0];
  let img = exclude;
  while (img === exclude) {
    img = list[Math.floor(Math.random() * list.length)];
  }
  return img;
}

function cinematicCrossfade(layerA, layerB, state, list) {
  const next = pickRandom(state.current, list);
  const incoming = state.toggle ? layerA : layerB;
  const outgoing = state.toggle ? layerB : layerA;

  incoming.style.backgroundImage = `url('${galleryFolder}${next}')`;

  // Cinematic fade
  incoming.classList.add("fade-in");
  outgoing.classList.add("fade-out");

  // Reset classes after animation
  setTimeout(() => {
    outgoing.classList.remove("fade-out");
    incoming.classList.remove("fade-in");
  }, 7500);

  state.current = next;
  state.toggle = !state.toggle;
}

window.addEventListener("load", async () => {
  const leftLane = document.querySelector(".gallery-left .gallery-lane-inner");
  const rightLane = document.querySelector(".gallery-right .gallery-lane-inner");

  if (!leftLane || !rightLane) return;

  const images = await fetchImages();
  if (!images.length) {
    console.warn("No images found in autoscan.");
    return;
  }

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
  const [rightA, rightB] = createLayers(rightLane);

  const leftState = { current: null, toggle: true };
  const rightState = { current: null, toggle: true };

  cinematicCrossfade(leftA, leftB, leftState, images);
  cinematicCrossfade(rightA, rightB, rightState, images);

  setInterval(() => cinematicCrossfade(leftA, leftB, leftState, images), 9000);
  setInterval(() => cinematicCrossfade(rightA, rightB, rightState, images), 9000);
});
