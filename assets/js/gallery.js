const galleryPath = "/assets/images/gallery/";
const manifestURL = galleryPath + "manifest.json";

let galleryImages = [];
let currentIndex = 0;

/* --- LOAD MANIFEST --- */
async function loadManifest() {
  try {
    const res = await fetch(manifestURL + "?v=" + Date.now());
    if (!res.ok) throw new Error("Manifest not found");

    const list = await res.json();
    return list.filter(name => name.match(/\.(jpg|jpeg|png|webp)$/i));
  } catch (err) {
    console.error("Error loading manifest:", err);
    return [];
  }
}

/* --- BUILD GALLERY GRID --- */
function buildGallery(images) {
  const grid = document.getElementById("gallery-grid");
  galleryImages = images;

  images.forEach((filename, index) => {
    const item = document.createElement("div");
    item.className = "gallery-item";

    const img = document.createElement("div");
    img.className = "gallery-thumb";
    img.style.backgroundImage = `url('${galleryPath}${filename}')`;

    img.addEventListener("click", () => {
      showImage(index);
      document.getElementById("lightbox").classList.add("active");
    });

    item.appendChild(img);
    grid.appendChild(item);
  });
}

/* --- LIGHTBOX FUNCTIONS --- */
function showImage(index) {
  currentIndex = index;
  document.getElementById("lightbox-img").src =
    galleryPath + galleryImages[currentIndex];
}

function showNextImage() {
  currentIndex = (currentIndex + 1) % galleryImages.length;
  showImage(currentIndex);
}

function showPrevImage() {
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  showImage(currentIndex);
}

/* --- KEYBOARD NAVIGATION --- */
document.addEventListener("keydown", (e) => {
  const lb = document.getElementById("lightbox");
  if (!lb.classList.contains("active")) return;

  if (e.key === "Escape") lb.classList.remove("active");
  if (e.key === "ArrowRight") showNextImage();
  if (e.key === "ArrowLeft") showPrevImage();
});

/* --- MOBILE SWIPE SUPPORT --- */
let startX = 0;

document.getElementById("lightbox").addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

document.getElementById("lightbox").addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const diff = endX - startX;

  if (Math.abs(diff) > 50) {
    if (diff < 0) showNextImage();   // swipe left → next
    if (diff > 0) showPrevImage();   // swipe right → previous
  }
});

/* --- CLOSE LIGHTBOX --- */
document.getElementById("lightbox-close").addEventListener("click", () => {
  document.getElementById("lightbox").classList.remove("active");
});

/* --- INIT --- */
loadManifest().then(buildGallery);
