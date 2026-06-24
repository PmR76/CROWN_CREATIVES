(function () {
  const panel = document.getElementById("theme-panel");
  const closeBtn = document.getElementById("theme-panel-close");

  // SHIFT + T toggles panel
  window.addEventListener("keydown", e => {
    if (e.key === "T" && e.shiftKey) {
      panel.classList.toggle("theme-panel-visible");
    }
  });

  closeBtn.addEventListener("click", () => {
    panel.classList.remove("theme-panel-visible");
  });

  // Day/Night buttons
  const buttons = panel.querySelectorAll("[data-bg]");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.bg === "night" ? "dark" : "day";
      document.dispatchEvent(new CustomEvent("theme-changed", { detail: mode }));
    });
  });
})();
(function () {
  const panel = document.getElementById("theme-panel");
  const header = document.getElementById("theme-panel-header");
  const closeBtn = document.getElementById("theme-panel-close");

  // SHIFT + T toggles panel
  window.addEventListener("keydown", e => {
    if (e.key === "T" && e.shiftKey) {
      panel.classList.toggle("theme-panel-visible");
    }
  });

  closeBtn.addEventListener("click", () => {
    panel.classList.remove("theme-panel-visible");
  });

  // DRAGGING
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  header.addEventListener("mousedown", e => {
    isDragging = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
    panel.style.transition = "none";
  });

  window.addEventListener("mousemove", e => {
    if (isDragging) {
      panel.style.left = `${e.clientX - offsetX}px`;
      panel.style.top = `${e.clientY - offsetY}px`;
    }
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
    panel.style.transition = "";
  });

})();
