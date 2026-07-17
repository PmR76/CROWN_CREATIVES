// ============================================================
// MusicSentinel — Safe, Non‑Blocking Diagnostics (Fixed)
// ============================================================

export async function runMusicSentinel() {
  const report = {
    manifestUrl: "/manifests/sound-manifest.json", // ✅ Correct path
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
    try {
      data = JSON.parse(text);
    } catch {
      report.error = "Manifest fetch returned HTML instead of JSON.";
      report.finalStatus = "MANIFEST_INVALID_JSON";
      return report;
    }

    if (!Array.isArray(data)) {
      report.error = "Sound manifest JSON is not an array.";
      report.finalStatus = "MANIFEST_INVALID_SHAPE";
      return report;
    }

    report.manifestValid = true;
    report.manifestLength = data.length;

    return report;

  } catch (err) {
    report.error = err.message;
    report.finalStatus = "UNEXPECTED_ERROR";
    return report;
  }
}
