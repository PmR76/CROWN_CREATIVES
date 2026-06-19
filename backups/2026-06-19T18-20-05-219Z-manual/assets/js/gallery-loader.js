/* ============================================================
   CROWN CREATIVES — GALLERY LOADER v3.1 (GR1 CLEAN)
   - Supports manifest formats:
       ["file1.jpg", "file2.png"]
       { images: ["file1.jpg", "file2.png"] }
   - Hero Gallery: shuffled
   - Full Gallery: sorted newest → oldest (YYYY-MM-DD-...)
   - Also loads: video + podcast manifests
============================================================ */

const GalleryLoader = {
  manifestPath: "/assets/images/gallery/manifest.json",
  cache: null,
  loading: false,

  /* ------------------------------------------------------------
     1. LOAD MANIFEST (cache‑busted, Cloudflare‑safe)
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
      const res = await fetch(this.manifestPath + "?v=" + Date.now(), {
        cache: "no-store"
      });

      if (!res.ok) throw new Error("Manifest not found");

      const data = await res.json();

      // Accepts:
      // ["file1.jpg", "file2.png"]
      // OR { images: ["file1.jpg", "file2.png"] }
