/* ============================================================
   HERO CROWN MODULE
   - Day/Night switching
   - Admin-only drag (SHIFT + C)
   - Admin-only resize (drag handle)
   - Position + size persistence
============================================================ */

(function () {
  const DAY_SRC = "/assets/icons/crown-day.png";
  const NIGHT_SRC = "/assets/icons/crown-night.png";
  const STORAGE_KEY = "heroCrownState";

  function createHeroCrown() {
    if (document.getElementById("hero-crown-wrapper")) return;

    const wrapper = document.createElement("div");
    wrapper.id = "hero-crown-wrapper";

    const dayImg = document.createElement("img");
    dayImg.id = "hero-crown-day";
    dayImg.src = DAY_SRC;
    dayImg.alt = "Crown (Day)";

    const nightImg = document.createElement("img");
    nightImg.id = "hero-crown-night";
    nightImg.src = NIGHT_SRC;
    nightImg.alt = "Crown (Night)";

    const handle = document.createElement("div");
    handle.className = "hero-crown-resize-handle";

    wrapper.appendChild(dayImg);
    wrapper.appendChild(nightImg);
    wrapper.appendChild(handle);

    const hero = document.getElementById("hero") || document.body;
    hero.appendChild(wrapper);

    return wrapper;
  }

  function loadState(wrapper) {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const state = JSON.parse(raw);
      if (typeof state.x === "number" && typeof state.y === "number") {
        wrapper.style.left = state.x + "px";
        wrapper.style.top = state.y + "px";
        wrapper.style.transform = "translateX(0)";
      }
      if (typeof state.size === "number") {
        wrapper.style.width = state.size + "px";
        wrapper.style.height = state.size + "px";
      }
    } catch (e) {
      console.warn("Hero crown state parse error:", e);
    }
  }

  function saveState(wrapper) {
    const rect = wrapper.getBoundingClientRect();
    const size = rect.width;
    const state = {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      size
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function initDragAndResize(wrapper) {
    let adminMode = false;
    let dragging = false;
    let resizing = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    let startSize = 0;

    const handle = wrapper.querySelector(".hero-crown-resize-handle");

    // Toggle admin mode: SHIFT + C
    window.addEventListener("keydown", e => {
      if (e.key === "C" && e.shiftKey) {
        adminMode = !adminMode;
        wrapper.classList.toggle("hero-crown-admin", adminMode);
      }
    });

    // Drag start
    wrapper.addEventListener("mousedown", e => {
      if (!adminMode) return;
      if (e.target === handle) return; // resize handled separately

      dragging = true;
      wrapper.classList.remove("hero-crown-resizing");

      const rect = wrapper.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startLeft = rect.left + window.scrollX;
      startTop = rect.top + window.scrollY;

      wrapper.style.transform = "translateX(0)";
      e.preventDefault();
    });

    // Resize start
    handle.addEventListener("mousedown", e => {
      if (!adminMode) return;

      resizing = true;
      wrapper.classList.add("hero-crown-resizing");

      const rect = wrapper.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startSize = rect.width;

      e.stopPropagation();
      e.preventDefault();
    });

    // Move / resize
    window.addEventListener("mousemove", e => {
      if (!dragging && !resizing) return;

      if (dragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        const newLeft = startLeft + dx;
        const newTop = startTop + dy;

        wrapper.style.left = newLeft + "px";
        wrapper.style.top = newTop + "px";
      }

      if (resizing) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const delta = Math.max(dx, dy);
        const newSize = Math.max(80, startSize + delta);

        wrapper.style.width = newSize + "px";
        wrapper.style.height = newSize + "px";
      }
    });

    // End drag / resize
    window.addEventListener("mouseup", () => {
      if (!dragging && !resizing) return;

      dragging = false;
      resizing = false;
      wrapper.classList.remove("hero-crown-resizing");
      saveState(wrapper);
    });
  }

  function initHeroCrown() {
    const wrapper = createHeroCrown();
    if (!wrapper) return;
    loadState(wrapper);
    initDragAndResize(wrapper);
  }

  // Expose for master.js
  window.initHeroCrown = initHeroCrown;
})();
