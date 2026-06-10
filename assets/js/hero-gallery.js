/* ============================================================
   HERO GALLERY v2 — AUTOSCAN + MANIFEST FALLBACK + CINEMATIC
   ============================================================ */

const galleryFolder = "/assets/images/gallery/";
const manifestPath = "/assets/images/gallery/gallery-manifest.json";

/* ------------------------------------------------------------
   1. PRIMARY SOURCE — GitHub API Autoscan
------------------------------------------------------------ */
async function fetchImagesFromGitHub() {
  try {
    const apiURL = `https://api.github.com/repos/pmr76/CROWN_CREATIVES/contents${galleryFolder}`;
    const res = await fetch(apiURL + "?v=" + Date.now());
    const data = await res.json();

    return data
      .filter(item => item.type === "file")
      .map(item => item.name)
      .filter(name => name.match(/\.(jpg|jpeg|png|webp)$/i));
  } catch (err) {
    console.error("GitHub autoscan failed:", err);
    return null; // important: null = failure, [] = empty
  }
}

/* ------------------------------------------------------------
   2. FALLBACK SOURCE — Manifest Loader
------------------------------------------------------------ */
async function fetchImagesFromManifest() {
  try {
    const res = await fetch(manifestPath, { cache: "no-store" });
    if (!res.ok) throw new Error("Manifest missing");
    const data = await res.json();
    return (data.images || []);
  } catch (err) {
    console.warn("Manifest fallback failed:", err);
    return [];
  }
}

/* ------------------------------------------------------------
   3. Unified Loader — GitHub → Manifest → Empty
------------------------------------------------------------ */
async function loadHeroImages() {
  let images = await fetchImagesFromGitHub();

  if (!images || !images.length) {
    console.warn("Falling back to gallery-manifest.json");
    images = await fetchImagesFromManifest();
  }

  if (!images.length) {
    console.error("No gallery images available.");
    return [];
  }

  return shuffle(images);
}

/* ------------------------------------------------------------
   4. Utility — Shuffle (Fisher-Yates)
------------------------------------------------------------ */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ------------------------------------------------------------
   5. Cinematic Crossfade Logic (unchanged)
------------------------------------------------------------ */
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

  incoming.classList.add("fade-in");
  outgoing.classList.add("fade-out");

  setTimeout(() => {
    outgoing.classList.remove("fade-out");
    incoming.classList.remove("fade-in");
  }, 7500);

  state.current = next;
  state.toggle = !state.toggle;
}

/* ------------------------------------------------------------
   6. HERO INITIALISATION
------------------------------------------------------------ */
window.addEventListener("load", async () => {
  const leftLane = document.querySelector(".gallery-left .gallery-lane-inner");
  const rightLane = document.querySelector(".gallery-right .gallery-lane-inner");

  if (!leftLane || !rightLane) return;

  const images = await loadHeroImages();
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
  const [rightA, rightB] = createLayers(rightLane);

  const leftState = { current: null, toggle: true };
  const rightState = { current: null, toggle: true };

  cinematicCrossfade(leftA, leftB, leftState, images);
  cinematicCrossfade(rightA, rightB, rightState, images);

  setInterval(() => cinematicCrossfade(leftA, leftB, leftState, images), 9000);
  setInterval(() => cinematicCrossfade(rightA, rightB, rightState, images), 9000);
});
