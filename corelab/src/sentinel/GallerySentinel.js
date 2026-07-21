// ============================================================
// GallerySentinel — Safe, Non‑Blocking Diagnostics (GR1 Stable)
// ============================================================

export async function runGallerySentinel() {
  const report = {
    manifestUrl: "/assets/images/gallery/gallery-manifest.json",
    manifestExists: false,
    manifestValid: false,
    manifestLength: 0,
    imagesResolvable: false,
    finalStatus: "OK",
    error: null
  };

  try {
    // ------------------------------------------------------------
    // 1. FETCH MANIFEST
    // ------------------------------------------------------------
    const res = await fetch(report.manifestUrl, { cache: "no-store" });

    if (!res.ok) {
      report.error = `Manifest fetch failed: HTTP ${res.status}`;
      report.finalStatus = "MANIFEST_FETCH_FAILED";
      return report;
    }

    report.manifestExists = true;

    // ------------------------------------------------------------
    // 2. PARSE JSON SAFELY
    // ------------------------------------------------------------
    let data;
    try {
      data = await res.json();
    } catch {
      report.error = "Manifest fetch returned HTML instead of JSON.";
      report.finalStatus = "MANIFEST_INVALID_JSON";
      return report;
    }

    // ------------------------------------------------------------
    // 3. VALIDATE SHAPE
    // ------------------------------------------------------------
    if (!Array.isArray(data)) {
      report.error = "Gallery manifest JSON is not an array.";
      report.finalStatus = "MANIFEST_INVALID_SHAPE";
      return report;
    }

    report.manifestValid = true;
    report.manifestLength = data.length;

    if (data.length === 0) {
      report.error = "Gallery manifest array is empty.";
      report.finalStatus = "MANIFEST_EMPTY";
      return report;
    }

    // ------------------------------------------------------------
    // 4. CHECK FIRST IMAGE LOADABILITY (NON‑BLOCKING)
    // ------------------------------------------------------------
    const firstUrl = `/assets/images/gallery/${data[0]}`;

    const img = new Image();
    const loadPromise = new Promise((resolve) => {
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });

    img.src = firstUrl;

    const ok = await loadPromise;
    report.imagesResolvable = ok;

    if (!ok) {
      report.error = `Image failed to load: ${firstUrl}`;
      report.finalStatus = "IMAGE_LOAD_FAILED";
      return report;
    }

    // ------------------------------------------------------------
    // 5. ALL GOOD
    // ------------------------------------------------------------
    report.finalStatus = "OK";
    return report;

  } catch (err) {
    report.error = err.message || "Unknown error";
    report.finalStatus = "UNEXPECTED_ERROR";
    return report;
  }
}
