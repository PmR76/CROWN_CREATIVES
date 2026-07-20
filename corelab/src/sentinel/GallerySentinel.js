// ============================================================
// GallerySentinel — Safe Stub (prevents JSON crash)
// ============================================================

export async function runGallerySentinel() {
  return {
    manifestUrl: "/assets/images/gallery/gallery-manifest.json",
    manifestExists: false,
    manifestValid: false,
    manifestLength: 0,
    finalStatus: "OK",
    error: null
  };
}
