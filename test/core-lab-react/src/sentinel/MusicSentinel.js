// ============================================================
// MusicSentinel — Safe, Non‑Blocking Diagnostics
// ============================================================

export async function runMusicSentinel() {
  const report = {
    manifestUrl: "/sounds/sound-manifest.json",
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

    const data = await res.json();

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
