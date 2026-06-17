/* ============================================================
   CROWN CREATIVES — FULL GALLERY ENGINE (GR1 CLEAN)
   Manifest → Grid → Lightbox → Keyboard → Swipe
============================================================ */

const galleryPath = "/assets/images/gallery/";
const manifestURL = galleryPath + "gallery-manifest.json";

let galleryImages = [];
let currentIndex = 0;

/* ------------------------------------------------------------
   1. LOAD MANIFEST (safe, cache‑busted, Cloudflare‑proof)
------------------------------------------------------------ */
async function loadManifest() {
  try {
    const res = await fetch(manifestURL + "?v=" + Date.now(), {
      cache: "no-store"
    });

    if (!res.ok) throw new Error("Manifest not found");

    const data = await res.json();
    return data.images || [];
  } catch (err) {
    console.error("Error loading gallery manifest:", err);
    return [];
  }
}

/* ------------------------------------------------------------
   2. BUILD GALLERY GRID (double‑init safe)
------------------------------------------------------------ */
function buildGallery(images) {
  const grid = document.getElementById("gallery-grid");
  if (!grid) {
    console.error("Gallery grid missing.");
    return;
  }

  // Prevent double‑initialisation
  if (grid.dataset.built === "1") return;
  grid.dataset.built = "1";

  galleryImages =