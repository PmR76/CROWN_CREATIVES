/* ============================================================
   CROWN CREATIVES — THEME ENGINE (GR1 MODULAR VERSION, V2)
   Global responsibilities:
   - Light / Dark / Neon / Sunset switching
   - Theme toggle behaviour
   - Draggable theme toggle (SHIFT + T)
   - LocalStorage persistence
   - Emits unified theme-change events for all modules
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
  const themes = ["light", "dark", "neon", "sunset"];

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

    /* ------------------------------------------------------------
       Notify ALL modules of theme change
       - Hero Crown V2 listens for "theme-changed"
       - Legacy modules listen for "cc-theme-changed"
       - Background + theme-panel also listen for both
    ------------------------------------------------------------ */

    // NEW unified event (Hero Crown V2)
    document.dispatchEvent(new CustomEvent("theme-changed", { detail: next }));

    // Legacy compatibility event
    window.dispatchEvent(new CustomEvent("cc-theme-changed", { detail: next }));
  }

  toggle.addEventListener("click", switchTheme);

  /* ============================================================
     5. DRAGGABLE THEME TOGGLE (SHIFT + T)
     Clean GR1 version — replaces old admin drag logic
  ============================================================= */

  const POS_KEY = "cc-theme-toggle-pos";
  const SIZE_KEY = "cc-theme-toggle-size";

  let adminMode = false;
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  /* ------------------------------
     Restore saved position
  ------------------------------ */
  const savedPos = localStorage.getItem(POS_KEY);
  if (savedPos) {
    try {
      const pos = JSON.parse(savedPos);
      toggle.style.position = "fixed";
      toggle.style.left = pos.x + "px";
      toggle.style.top = pos.y + "px";
    } catch (e) {
      console.warn("Theme toggle pos parse error:", e);
    }
  }

  /* ------------------------------
     Restore saved size
  ------------------------------ */
  const savedSize = localStorage.getItem(SIZE_KEY);
  if (savedSize) {
    toggle.style.width = savedSize + "px";
    toggle.style.height = savedSize + "px";
  }

  /* ------------------------------
     SHIFT + T → Admin mode toggle
  ------------------------------ */
  window.addEventListener("keydown", e => {
    if (e.key === "T" && e.shiftKey) {
      adminMode = !adminMode;
      toggle.classList.toggle("theme-toggle-admin", adminMode);
    }
  });

  /* ------------------------------
     Drag start
  ------------------------------ */
  toggle.addEventListener("mousedown", e => {
    if (!adminMode) return;

    dragging = true;

    const rect = toggle.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startLeft = rect.left;
    startTop = rect.top;

    toggle.style.position = "fixed";
    toggle.style.transition = "none";

    e.preventDefault();
  });

  /* ------------------------------
     Drag move
  ------------------------------ */
  window.addEventListener("mousemove", e => {
    if (!dragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    toggle.style.left = startLeft + dx + "px";
    toggle.style.top = startTop + dy + "px";
  });

  /* ------------------------------
     Drag end
  ------------------------------ */
  window.addEventListener("mouseup", () => {
    if (!dragging) return;

    dragging = false;
    toggle.style.transition = "";

    const rect = toggle.getBoundingClientRect();
    const pos = { x: rect.left, y: rect.top };
    localStorage.setItem(POS_KEY, JSON.stringify(pos));
  });

  /* ------------------------------
     Resize with scroll wheel
  ------------------------------ */
  toggle.addEventListener("wheel", e => {
    if (!adminMode) return;

    e.preventDefault();

    let size = parseInt(toggle.style.width || 38);
    size += e.deltaY < 0 ? 2 : -2;
    size = Math.max(24, Math.min(80, size));

    toggle.style.width = size + "px";
    toggle.style.height = size + "px";

    localStorage.setItem(SIZE_KEY, size);
  });
};
