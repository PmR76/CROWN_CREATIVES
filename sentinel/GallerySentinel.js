// C:\DEV\CROWN_CREATIVES\test\core-lab-react\src\sentinel\GallerySentinel.js

// ============================================================
// GallerySentinel — End-to-End Gallery Diagnostics
// ============================================================

const MANIFEST_URL = "/assets/images/gallery/gallery-manifest.json";
const IMAGE_BASE = "/assets/images/gallery/";

export async function runGallerySentinel() {
  const report = {
    manifestUrl: MANIFEST_URL,
    manifestReachable: false,
    manifestJsonValid: false,
    manifestType: null,
    manifestLength: 0,
    imageUrls: [],
    imageLoadResults: [],
    heroGalleryMounted: false,
    heroGalleryHasImages: false,
    finalStatus: "UNKNOWN",
    error: null
  };

  try {
    // 1) Check manifest fetch
    const res = await fetch(MANIFEST_URL);
    if (!res.ok) {
      report.error = `Manifest fetch failed: HTTP ${res.status}`;
      report.finalStatus = "MANIFEST_FETCH_FAILED";
      console.warn("[GallerySentinel]", report);
      return report;
    }

    report.manifestReachable = true;

    // 2) Check JSON validity + shape
    const data = await res.json();
    report.manifestJsonValid = true;
    report.manifestType = Array.isArray(data) ? "array" : typeof data;

    if (!Array.isArray(data)) {
      report.error = `Manifest is not an array. Got: ${report.manifestType}`;
      report.finalStatus = "MANIFEST_SHAPE_INVALID";
      console.warn("[GallerySentinel]", report);
      return report;
    }

    report.manifestLength = data.length;

    if (data.length === 0) {
      report.error = "Manifest array is empty.";
      report.finalStatus = "MANIFEST_EMPTY";
      console.warn("[GallerySentinel]", report);
      return report;
    }

    // 3) Build image URLs
    const urls = data.map(f => `${IMAGE_BASE}${f}`);
    report.imageUrls = urls;

    // 4) Check each image actually loads
    const loadChecks = await Promise.all(
      urls.map(
        url =>
          new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve({ url, ok: true });
            img.onerror = () => resolve({ url, ok: false });
            img.src = url;
          })
      )
    );

    report.imageLoadResults = loadChecks;

    const anyOk = loadChecks.some(r => r.ok);
    if (!anyOk) {
      report.error = "No gallery images could be loaded from URLs.";
      report.finalStatus = "IMAGES_UNREACHABLE";
      console.warn("[GallerySentinel]", report);
      return report;
    }

    // 5) Check HeroGallery DOM presence
    const container = document.querySelector(".hero-gallery-container");
    const imgs = document.querySelectorAll(".hero-gallery-img");

    report.heroGalleryMounted = !!container;
    report.heroGalleryHasImages = imgs.length > 0;

    if (!report.heroGalleryMounted) {
      report.error = "HeroGallery component is not mounted in DOM.";
      report.finalStatus = "COMPONENT_NOT_MOUNTED";
      console.warn("[GallerySentinel]", report);
      return report;
    }

    if (!report.heroGalleryHasImages) {
      report.error = "HeroGallery DOM exists but has no <img> elements.";
      report.finalStatus = "COMPONENT_NO_IMAGES";
      console.warn("[GallerySentinel]", report);
      return report;
    }

    // 6) If we reach here, everything is structurally correct
    report.finalStatus = "OK";
    console.info("[GallerySentinel] Gallery pipeline OK:", report);
    return report;
  } catch (err) {
    report.error = `Unexpected error: ${err.message}`;
    report.finalStatus = "UNEXPECTED_ERROR";
    console.error("[GallerySentinel]", report);
    return report;
  }
}
