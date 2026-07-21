// ============================================================
// MusicSentinel — Safe, Non‑Blocking Diagnostics (GR1 Stable)
// ============================================================

export async function runMusicSentinel() {
  const report = {
    manifestUrl: "/manifests/sound-manifest.json",
    manifestExists: false,
    manifestValid: false,
    manifestLength: 0,
    finalStatus: "OK",
    error: null
  };

  try {
    const res = await fetch(report.manifestUrl);

    if (!res.ok) {
      report.error = `Sound manifest fetch failed: HTTP ${res.status}`;
      report.finalStatus = "MANIFEST_FETCH_FAILED";
      return report;
    }

    report.manifestExists = true;

    const text = await res.text();
    let data;

    // ------------------------------------------------------------
    // SAFE JSON PARSE
    // ------------------------------------------------------------
    try {
      data = JSON.parse(text);
    } catch {
      report.error = "Manifest fetch returned HTML instead of JSON.";
      report.finalStatus = "MANIFEST_INVALID_JSON";
      return report;
    }

    // ------------------------------------------------------------
    // VALIDATE SHAPE
    // ------------------------------------------------------------
    if (!Array.isArray(data.tracks)) {
      report.error = "Sound manifest JSON does not contain a 'tracks' array.";
      report.finalStatus = "MANIFEST_INVALID_SHAPE";
      return report;
    }

    report.manifestValid = true;
    report.manifestLength = data.tracks.length;

    return report;

  } catch (err) {
    report.error = err.message || "Unknown error";
    report.finalStatus = "UNEXPECTED_ERROR";
    return report;
  }
}
