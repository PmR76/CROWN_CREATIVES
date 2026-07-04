console.log("[EVOLVE] OS Window Manager online");

function initOSWindows() {
  const windows = Array.from(document.querySelectorAll(".os-window"));
  let activeWindow = null;
  let dragState = null;

  function activateWindow(win) {
    windows.forEach(w => w.classList.remove("os-window-active"));
    win.classList.add("os-window-active");
    activeWindow = win;
  }

  // Dock icon click -> show window
  document.querySelectorAll(".os-dock-icon").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-window");
      const win = document.querySelector(`.os-window[data-window-id="${id}"]`);
      if (!win) return;
      win.classList.remove("os-window-hidden");
      activateWindow(win);
    });
  });

  // Minimize buttons
  windows.forEach(win => {
    const minBtn = win.querySelector("[data-action='minimize']");
    if (!minBtn) return;
    minBtn.addEventListener("click", () => {
      win.classList.add("os-window-hidden");
      if (activeWindow === win) activeWindow = null;
    });
  });

  // Dragging
  windows.forEach(win => {
    const handle = win.querySelector("[data-drag-handle]");
    if (!handle) return;

    handle.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      activateWindow(win);
      const rect = win.getBoundingClientRect();
      dragState = {
        win,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top
      };
      window.addEventListener("pointermove", onDragMove);
      window.addEventListener("pointerup", onDragEnd);
    });
  });

  function onDragMove(e) {
    if (!dragState) return;
    const { win, offsetX, offsetY } = dragState;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    win.style.left = x + "px";
    win.style.top = y + "px";
  }

  function onDragEnd() {
    dragState = null;
    window.removeEventListener("pointermove", onDragMove);
    window.removeEventListener("pointerup", onDragEnd);
  }

  // Orb status hook
  const orb = document.getElementById("evolveOrb");
  if (orb) {
    window.addEventListener("EVOLVE_DOUBLE_TAP", () => {
      orb.classList.add("orb-active");
      setTimeout(() => orb.classList.remove("orb-active"), 600);
    });
  }

  // Activate dashboard by default
  const dash = document.querySelector('.os-window[data-window-id="dashboard"]');
  if (dash) activateWindow(dash);
}

window.addEventListener("load", initOSWindows);
