/* ============================================================
   CROWN CREATIVES — HERO WINDOW ENGINE v1.0
   ============================================================ */

window.initHeroWindow = () => {
  const win = document.getElementById("heroWindow");
  const img = document.getElementById("heroWindowImage");

  if (!win || !img) return;

  /* ---------------------------------------------
     1. AUTO-SCAN GALLERY FOLDER
     --------------------------------------------- */
  fetch("../assets/images/gallery/")
    .then(r => r.text())
    .then(text => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");

      const files = [...doc.querySelectorAll("a")]
        .map(a => a.getAttribute("href"))
        .filter(h => h.match(/\.(jpg|jpeg|png|webp|gif)$/i))
        .map(h => "../assets/images/gallery/" + h);

      if (!files.length) return;

      let index = 0;

      const cycle = () => {
        img.style.opacity = 0;

        setTimeout(() => {
          img.src = files[index];
          img.onload = () => {
            img.style.opacity = 1;
          };

          index = (index + 1) % files.length;
        }, 1500);
      };

      cycle();
      setInterval(cycle, 8000 + 1500 + 1500);
    });

  /* ---------------------------------------------
     2. RESTORE SAVED POSITION
     --------------------------------------------- */
  const saved = localStorage.getItem("heroWindowPos");
  if (saved) {
    const pos = JSON.parse(saved);
    win.style.left = pos.x + "px";
    win.style.top = pos.y + "px";
    win.style.transform = "translate(0,0)";
  }

  /* ---------------------------------------------
     3. ADMIN DRAG MODE (toggle with SHIFT + H)
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
