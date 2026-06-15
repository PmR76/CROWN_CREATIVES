/* ============================================================
   CROWN CREATIVES — THEME ENGINE (GR1 MODULAR VERSION)
   Supports:
   - Light / Dark
   - Neon / Sunset (experimental)
   - Unlimited future palettes
   - Crown sync
   - Background sync
   - Admin-only drag + resize
   - LocalStorage persistence
============================================================ */

window.initThemeEngine = function () {

  /* ------------------------------
     1. Locate the toggle
  ------------------------------ */
  const toggle = document.getElementById("themeToggle");
  if (!toggle) {
    console.warn("Theme toggle not found.");
    return;
  }

  /* ------------------------------
     2. Theme list (expand anytime)
  ------------------------------ */
  const themes = [
    "light",
    "dark",
    "neon",
    "sunset"
  ];

  /* ------------------------------
     3. Load saved theme
  ------------------------------ */
  const savedTheme = localStorage.getItem("cc-theme") || "dark";
  document.body.setAttribute("data-theme", savedTheme);

  /* ------------------------------
     4. Theme switching logic
  ------------------------------ */
  function switchTheme() {
    const current = document.body.getAttribute("data-theme");
    const next = themes[(themes.indexOf(current) + 1) % themes.length];

    document.body.setAttribute("data-theme", next);
    localStorage.setItem("cc-theme", next);

    updateCrown(next);
    updateBackground(next);
  }

  toggle.addEventListener("click", switchTheme);

  /* ------------------------------
     5. Crown Sync
  ------------------------------ */
  const crownDay = document.getElementById("hero-crown-day");
  const crownNight = document.getElementById("hero-crown-night");

  function updateCrown(theme) {
    if (!crownDay || !crownNight) return;

    if (theme === "light") {
      crownDay.style.opacity = 1;
      crownNight.style.opacity = 0;
    } else {
      crownDay.style.opacity = 0;
      crownNight.style.opacity = 1;
    }
  }

  updateCrown(savedTheme);

  /* ------------------------------
     6. Background Sync
     (Optional — works with your test backgrounds)
  ------------------------------ */
  function updateBackground(theme) {
    const dayBg = document.querySelector(".day-background");
    const nightBg = document.querySelector(".night-background");

    if (!dayBg || !nightBg) return;

    if (theme === "light") {
      dayBg.style.opacity = 1;
      nightBg.style.opacity = 0;
    } else {
      dayBg.style.opacity = 0;
      nightBg.style.opacity = 1;
    }
  }

  updateBackground(savedTheme);

  /* ------------------------------
     7. ADMIN MODE (drag + resize)
     Only active for you
  ------------------------------ */
  const isAdmin = true; // later: tie to login

  if (isAdmin) {
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    // DRAG START
    toggle.addEventListener("mousedown", (e) => {
      dragging = true;
      offsetX = e.clientX - toggle.offsetLeft;
      offsetY = e.clientY - toggle.offsetTop;
      toggle.style.transition = "none";
    });

    // DRAG MOVE
    document.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      toggle.style.position = "fixed";
      toggle.style.left = `${e.clientX - offsetX}px`;
      toggle.style.top = `${e.clientY - offsetY}px`;
    });

    // DRAG END
    document.addEventListener("mouseup", () => {
      if (dragging) {
        dragging = false;
        toggle.style.transition = "";
        localStorage.setItem(
          "cc-theme-toggle-pos",
          JSON.stringify({
            left: toggle.style.left,
            top: toggle.style.top
          })
        );
      }
    });

    // RESTORE POSITION
    const savedPos = localStorage.getItem("cc-theme-toggle-pos");
    if (savedPos) {
      const pos = JSON.parse(savedPos);
      toggle.style.position = "fixed";
      toggle.style.left = pos.left;
      toggle.style.top = pos.top;
    }

    /* ------------------------------
       8. ADMIN RESIZE (scroll wheel)
    ------------------------------ */
    toggle.addEventListener("wheel", (e) => {
      e.preventDefault();

      let size = parseInt(toggle.style.width || 38);
      size += e.deltaY < 0 ? 2 : -2;
      size = Math.max(24, Math.min(80, size));

      toggle.style.width = `${size}px`;
      toggle.style.height = `${size}px`;

      localStorage.setItem("cc-theme-toggle-size", size);
    });

    // RESTORE SIZE
    const savedSize = localStorage.getItem("cc-theme-toggle-size");
    if (savedSize) {
      toggle.style.width = `${savedSize}px`;
      toggle.style.height = `${savedSize}px`;
    }
  }
};
