/* ============================================================
   CROWN CREATIVES — GALLERY LOADER v4 (GR6 Hardened)
   - Supports manifest formats:
       ["file1.jpg", "file2.png"]
       { images: ["file1.jpg", "file2.png"] }
   - Hero Gallery: shuffled
   - Full Gallery: sorted newest → oldest (YYYY-MM-DD-...)
   - Cloudflare‑safe, cache‑busted, hardened JSON loader
============================================================ */

const GalleryLoader = {
  manifestPath: "/assets/images/gallery/gallery-manifest.json",
  cache: null,
  loading: false,

  /* ------------------------------------------------------------
     1. LOAD MANIFEST (cache‑busted, hardened)
  ------------------------------------------------------------ */
  async loadManifest() {
    // Prevent double-loading
    if (this.cache) return this.cache;

    if (this.loading) {
      // Wait for the first load to finish
      return new Promise(resolve => {
        const wait = setInterval(() => {
          if (this.cache !== null) {
            clearInterval(wait);
            resolve(this.cache);
          }
        }, 50);
      });
    }

    this.loading = true;

    try {
      const url = this.manifestPath + "?t=" + Date.now();

      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) {
        throw new Error("Manifest fetch failed: " + res.status);
      }

      // Try to parse JSON safely
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error("Manifest JSON parse failed — likely HTML returned");
      }

      // Accept:
      // ["file1.jpg", "file2.png"]
      // OR { images: ["file1.jpg", "file2.png"] }
      let files = [];

      if (Array.isArray(data)) {
        files = data;
      } else if (data && Array.isArray(data.images)) {
        files = data.images;
      } else {
        throw new Error("Manifest format invalid — expected array or { images: [] }");
      }

      // Convert to objects with URLs
      const images = files.map(name => ({
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
     2. HERO IMAGES (shuffled)
  ------------------------------------------------------------ */
  async getHeroImages(limit = null) {
    const images = await this.loadManifest();
    const shuffled = this.shuffle([...images]);

    if (limit && limit > 0) {
      return shuffled.slice(0, limit);
    }
    return shuffled;
  },

  /* ------------------------------------------------------------
     3. FULL GALLERY (sorted newest → oldest)
  ------------------------------------------------------------ */
  async getFullGalleryImages() {
    const images = await this.loadManifest();

    const sorted = [...images].sort((a, b) => {
      if (a.name < b.name) return 1;
      if (a.name > b.name) return -1;
      return 0;
    });

    return sorted;
  },

  /* ------------------------------------------------------------
     4. SHUFFLE UTILITY
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
============================================================ */
async function loadVideoManifest() {
  try {
    const res = await fetch("/assets/videos/video-manifest.json?t=" + Date.now(), {
      cache: "no-store"
    });
    const data = await res.json();
    return data.videos || [];
  } catch {
    return [];
  }
}

/* ============================================================
   PODCAST MANIFEST LOADER
============================================================ */
async function loadPodcastManifest() {
  try {
    const res = await fetch("/assets/podcasts/podcast-manifest.json?t=" + Date.now(), {
      cache: "no-store"
    });
    const data = await res.json();
    return data.podcasts || [];
  } catch {
    return [];
  }
}
