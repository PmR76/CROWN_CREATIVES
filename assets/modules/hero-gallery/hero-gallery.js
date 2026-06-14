/* ============================================================
   HERO GALLERY MODULE — LOGIC ENGINE
   Auto‑scan • Fade • Hold • Fade • Loop
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  const GALLERY_PATH = "/assets/images/gallery/";
  const DISPLAY_TIME = 8000; // 8 seconds
  const lanes = document.querySelectorAll(".gallery-lane-inner");

  // Fetch all images in the gallery folder
  fetch(GALLERY_PATH)
    .then(res => res.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Extract file names
      const files = [...doc.querySelectorAll("a")]
        .map(a => a.getAttribute("href"))
        .filter(name => /\.(jpg|jpeg|png|webp|gif)$/i.test(name));

      if (files.length === 0) return;

      // Create independent loops for each lane
      lanes.forEach((lane, index) => {
        let current = 0;

        // Create image elements
        const images = files.map(file => {
          const div = document.createElement("div");
          div.className = "gallery-image";
          div.style.backgroundImage = `url(${GALLERY_PATH}${file})`;
          lane.appendChild(div);
          return div;
        });

        // Start rotation
        const cycle = () => {
          images.forEach(img => img.classList.remove("active"));
          images[current].classList.add("active");

          current = (current + 1) % images.length;
        };

        cycle(); // show first image immediately
        setInterval(cycle, DISPLAY_TIME + 2000); // 8s hold + 2s fade
      });
    });
});
