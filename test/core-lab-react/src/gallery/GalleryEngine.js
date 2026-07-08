// ============================================================
// GalleryEngine — Shared Manifest Loader for Both React Labs
// ============================================================

export async function loadGallery() {
  const res = await fetch("/manifests/gallery-manifest.json");
  const data = await res.json();
  return data.images.map(f => `/gallery/${f}`);
}
