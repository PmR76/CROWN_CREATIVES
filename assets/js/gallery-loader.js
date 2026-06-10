/* ============================================================
   GALLERY LOADER v2.0 — FINAL
   - Loads: /assets/images/gallery/gallery-manifest.json
   - Hero Gallery: shuffled
   - Full Gallery: date-ordered (by filename)
   - Also exposes: video + podcast manifest loaders
============================================================ */

const GalleryLoader = {
  manifestPath: "/assets/images/gallery/gallery-manifest.json",
  cache: null,

  /* ------------------------------------------------------------
     Load gallery manifest (shared by hero + full gallery)
  ------------------------------------------------------------ */
  async loadManifest() {
    if (this.cache) return this.cache;

    try {
      const res = await fetch(this.manifestPath, { cache: "no-store" });
      if (!res.ok) throw new Error("Manifest not found");

      const data = await res.json();

      // Expected format:
      // { "images": ["file1.jpg", "file2.webp", ...] }
      const images = (data.images || []).map(name => ({
        name,
        url: `/assets/images/gallery/${name}`
      }));

      this.cache = images;
      return images;
    } catch (err) {
      console.warn("Gallery manifest load failed:", err);
      this.cache = [];
      return [];
    }
  },

  /* ------------------------------------------------------------
     HERO GALLERY — shuffled list
  ------------------------------------------------------------ */
  async getHeroImages(limit = null) {
    const images = await this.loadManifest();
    const shuffled = this.shuffle([...images]);

    return limit ? shuffled.slice(0, limit) : shuffled;
  },

  /* ------------------------------------------------------------
     FULL GALLERY — sorted newest → oldest
     (Assumes filenames begin with YYYY-MM-DD-...)
  ------------------------------------------------------------ */
  async getFullGalleryImages() {
    const images = await this.loadManifest();

    return [...images].sort((a, b) => {
      if (a.name < b.name) return 1;
      if (a.name > b.name) return -1;
      return 0;
    });
  },

  /* ------------------------------------------------------------
     Utility — Fisher-Yates shuffle
  ------------------------------------------------------------ */
  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
};

/* ============================================================
   VIDEO MANIFEST LOADER
   Path: /assets/videos/video-manifest.json
============================================================ */

async function loadVideoManifest() {
  try {
    const res = await fetch("/assets/videos/video-manifest.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Video manifest missing");

    const data = await res.json();
    return data.videos || [];
  } catch (err) {
    console.warn("Video manifest load failed:", err);
    return [];
  }
}

/* ============================================================
   PODCAST MANIFEST LOADER
   Path: /assets/podcasts/podcast-manifest.json
============================================================ */

async function loadPodcastManifest() {
  try {
    const res = await fetch("/assets/podcasts/podcast-manifest.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Podcast manifest missing");

    const data = await res.json();
    return data.podcasts || [];
  } catch (err) {
    console.warn("Podcast manifest load failed:", err);
    return [];
  }
}

/* ============================================================
   OPTIONAL HOOKS (for debugging)
============================================================ */

async function initHeroGalleryFromManifest() {
  const images = await GalleryLoader.getHeroImages();
  console.log("Hero images (shuffled):", images);
}

async function initFullGalleryFromManifest() {
  const images = await GalleryLoader.getFullGalleryImages();
  console.log("Full gallery images (sorted):", images);
}
