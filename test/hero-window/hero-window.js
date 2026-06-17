/* ============================================================
   CROWN CREATIVES — HERO WINDOW ENGINE v3.0
   Manifest + Validation + Fallback
   ============================================================ */

window.initHeroWindow = () => {
  const win = document.getElementById("heroWindow");
  const img = document.getElementById("heroWindowImage");

  if (!win || !img) return;

  const FALLBACK = "../assets/images/fallback.jpg"; 
  // Add a fallback image to your assets folder

  /* ---------------------------------------------
     1. LOAD + VALIDATE MANIFEST
     --------------------------------------------- */
  fetch("../assets/images/gallery/gallery-manifest.json")
    .then(r => {
      if (!r.ok) {
        console.warn("Manifest missing or unreadable. Using fallback.");
        startFallback();
        return null;
      }
      return r.json();
    })
    .then(files => {
      if (!files) return;

      // Validate manifest entries
      const valid = files.filter(f =>
        typeof f === "string" &&
        f.match(/\.(jpg|jpeg|png|webp|gif)$/i)
      );

      if (!valid.length) {
        console.warn("Manifest contains no valid images. Using fallback.");
        startFallback();
        return;
      }

      const paths = valid.map(f => "../assets/images/gallery/" + f);
      startCycle(paths);
    })
    .catch(err => {
      console.error("Manifest load error:", err);
      startFallback();
    });

  /* ---------------------------------------------
     2. IMAGE CYCLE (fade in/out)
     --------------------------------------------- */
  function startCycle(paths) {
    let index = 0;

    const cycle = () => {
      img.style.opacity = 0;

      setTimeout(() => {
        const src = paths[index];

        img.onerror = () => {
          console.warn("Image failed:", src, "→ using fallback");
          img.src = FALLBACK;
          img.style.opacity = 1;
        };

        img.onload = () => {
          img.style.opacity = 1;
        };

        img.src = src;

        index = (index + 1) % paths.length;
      }, 1500);
    };

    cycle();
    setInterval(cycle, 8000 + 1500 + 1500);
  }

  /* ---------------------------------------------
     3. FALLBACK MODE
     --------------------------------------------- */
  function startFallback() {
    img.src = FALLBACK;
    img.style.opacity = 1;
  }

  /* ---------------------------------------------
     4. RESTORE SAVED POSITION
     --------------------------------------------- */
  const saved = localStorage.getItem("heroWindowPos");
  if (saved) {
    const pos = JSON.parse(saved);
    win.style.left = pos.x + "px";
    win.style.top = pos.y + "px";
    win.style.transform = "translate(0,0)";
  }

  /* ---------------------------------------------
     5. ADMIN DRAG MODE (SHIFT + H)
     --------------------------------------------- */
  let adminMode = false;
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  window.addEventListener("keydown", e => {
    if (e.key === "H" && e.shiftKey) {
      adminMode = !adminMode;
      win.classList.toggle("admin-draggable", adminMode);
    }
  });

  win.addEventListener("mousedown", e => {
    if (!adminMode) return;

    dragging = true;
    win.classList.add("admin-dragging");

    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
  });

  window.addEventListener("mousemove", e => {
    if (!dragging) return;

    win.style.left = (e.clientX - offsetX) + "px";
    win.style.top = (e.clientY - offsetY) + "px";
    win.style.transform = "translate(0,0)";
  });

  window.addEventListener("mouseup", () => {
    if (!dragging) return;

    dragging = false;
    win.classList.remove("admin-dragging");

    localStorage.setItem("heroWindowPos", JSON.stringify({
      x: win.offsetLeft,
      y: win.offsetTop
    }));
  });
};
