// ============================================================
// GallerySentinel — Safe, Non‑Blocking Diagnostics
// ============================================================

export async function runGallerySentinel() {
  const report = {
    manifestUrl: "/assets/images/gallery/gallery-manifest.json",
    manifestExists: false,
    manifestValid: false,
    manifestLength: 0,
    imagesResolved: false,
    heroGalleryMounted: false,
    finalStatus: "OK",   // ⭐ default to OK so it NEVER breaks rendering
    error: null
  };

  try {
    // 1. Check manifest fetch
    const res = await fetch(report.manifestUrl);

    if (!res.ok) {
      report.error = `Manifest fetch failed: HTTP ${res.status}`;
      report.finalStatus = "MANIFEST_FETCH_FAILED";
      return report; // ⭐ safe return
    }

    report.manifestExists = true;

    // 2. Check JSON validity
    const data = await res.json();

    if (!Array.isArray(data)) {
      report.error = "Manifest JSON is not an array.";
      report.finalStatus = "MANIFEST_INVALID_SHAPE";
      return report;
    }

    report.manifestValid = true;
    report.manifestLength = data.length;

    if (data.length === 0) {
      report.error = "Manifest array is empty.";
      report.finalStatus = "MANIFEST_EMPTY";
      return report;
    }

    // 3. Check first image load (non‑blocking)
    const urls = data.map(f => `/assets/images/gallery/${f}`);
    const first = urls[0];

    const img = new Image();
    const ok = await new Promise(resolve => {
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = first;
    });

    report.imagesResolved = ok;

    // 4. Check HeroGallery DOM (non‑blocking)
    const container = document.querySelector(".hero-gallery-container");
    report.heroGalleryMounted = !!container;

    return report; // ⭐ ALWAYS return safely

  } catch (err) {
    report.error = err.message;
    report.finalStatus = "UNEXPECTED_ERROR";
    return report; // ⭐ NEVER throw
  }
}
