// ============================================================
// GalleryEngine — Auto-Populated Manifest Loader (GR1 Stable)
// ============================================================

export async function loadGallery() {
  try {
    // Correct manifest path (matches your public/assets structure)
    const res = await fetch("/assets/images/gallery/gallery-manifest.json", {
      cache: "no-store"
    });

    if (!res.ok) {
      console.warn("Gallery manifest fetch failed:", res.status);
      return [];
    }

    let data;
    try {
      data = await res.json();
    } catch (err) {
      console.warn("Gallery manifest is not valid JSON:", err);
      return [];
    }

    // Manifest must be an array of filenames
    if (!Array.isArray(data)) {
      console.warn("Gallery manifest is not an array:", data);
      return [];
    }

    // Map filenames to correct public path
    return data.map((f) => `/assets/images/gallery/${f}`);

  } catch (err) {
    console.warn("GalleryEngine loadGallery() crashed:", err);
    return [];
  }
}
