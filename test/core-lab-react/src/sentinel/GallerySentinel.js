// ============================================================
// GallerySentinel — Minimal Structural Diagnostic
// ============================================================

export async function runGallerySentinel() {
  const report = {
    manifestUrl: "/assets/images/gallery/gallery-manifest.json",
    manifestExists: false,
    manifestValid: false,
    manifestLength: 0,
    imagesResolved: false,
    heroGalleryMounted: false,
    finalStatus: "UNKNOWN",
    error: null
  };

  try {
    // 1. Check manifest fetch
    const res = await fetch(report.manifestUrl);
    if (!res.ok) {
      report.error = `Manifest fetch failed: HTTP ${res.status}`;
      report.finalStatus = "MANIFEST_FETCH_FAILED";
      return report;
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

    // 3. Check image URLs
    const urls = data.map(f => `/assets/images/gallery/${f}`);
    const first = urls[0];

    const img = new Image();
    const loadPromise = new Promise(resolve => {
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });

    img.src = first;
    const ok = await loadPromise;

    report.imagesResolved = ok;

    if (!ok) {
      report.error = `Image failed to load: ${first}`;
      report.finalStatus = "IMAGE_LOAD_FAILED";
      return report;
    }

    // 4. Check HeroGallery DOM
    const container = document.querySelector(".hero-gallery-container");
    report.heroGalleryMounted = !!container;

    if (!report.heroGalleryMounted) {
      report.error = "HeroGallery component not mounted.";
      report.finalStatus = "COMPONENT_NOT_MOUNTED";
      return report;
    }

    // 5. All good
    report.finalStatus = "OK";
    return report;

  } catch (err) {
    report.error = err.message;
    report.finalStatus = "UNEXPECTED_ERROR";
    return report;
    window.__sentinel_ok = true;

  }
}
