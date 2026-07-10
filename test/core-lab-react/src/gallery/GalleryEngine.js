// ============================================================
// GalleryEngine — Auto-Populated Manifest Loader (Correct Path)
// ============================================================

export async function loadGallery() {
  // Correct manifest path (matches your screenshot)
  const res = await fetch("/assets/images/gallery/gallery-manifest.json");

  const data = await res.json();

  // Manifest is a simple array of filenames
  if (!Array.isArray(data)) {
    console.warn("Gallery manifest is not an array:", data);
    return [];
  }

  // Map filenames to correct public path
  return data.map(f => `/assets/images/gallery/${f}`);
}
