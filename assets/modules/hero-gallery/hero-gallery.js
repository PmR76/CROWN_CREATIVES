/* ============================================================
   HERO GALLERY — MANIFEST-POWERED (v=20240614-1210)
   Cloudflare‑Safe • Fade‑Hold‑Fade • Mobile‑Aware
============================================================ */

const galleryPath = "/assets/images/gallery/";
const manifestURL = galleryPath + "manifest.json";

async function loadManifest() {
  try {
    const res = await fetch(manifestURL + "?v=" + Date.now());
    if (!res.ok) throw new Error("Manifest not found");
    const list = await res.json();
    return list.filter(name =>
      name.match(/\.(jpg|jpeg|png|webp)$/i)
    );
  } catch (err) {
    console.error("Failed to load manifest:", err);
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

function crossfade(layerA, layerB, state, list) {
  const next = pickRandom(state.current, list);
  const incoming = state.toggle ? layerA : layerB;
  const outgoing = state.toggle ? layerB : layerA;

  incoming.style.backgroundImage = `url('${galleryPath}${next}')`;
  incoming.classList.add("active");
  outgoing.classList.remove("active");

  state.current = next;
  state.toggle = !state.toggle;
}

window.addEventListener("load", async () => {
  const leftLane = document.querySelector(".gallery-left .gallery-lane-inner");
  const rightLane = document.querySelector(".gallery-right .gallery-lane-inner");

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (!leftLane) return;

  const images = await loadManifest();
  if (!images.length) {
    console.warn("No images found in manifest.");
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
  const leftState = { current: null, toggle: true };
  crossfade(leftA, leftB, leftState, images);
  setInterval(() => crossfade(leftA, leftB, leftState, images), 10000);

  if (!isMobile && rightLane) {
    const [rightA, rightB] = createLayers(rightLane);
    const rightState = { current: null, toggle: true };
    crossfade(rightA, rightB, rightState, images);
    setInterval(() => crossfade(rightA, rightB, rightState, images), 10000);
  }
});
