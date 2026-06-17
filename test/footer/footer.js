// ADMIN MODE TOGGLE
let adminMode = false;

document.addEventListener("keydown", e => {
  if (e.key === "A" && e.shiftKey) {
    adminMode = !adminMode;
    document.body.classList.toggle("admin-mode", adminMode);
  }
});

// DRAGGABLE ICONS
const icons = document.querySelectorAll(".footer-icon");

icons.forEach(icon => {
  const id = icon.dataset.id;

  // Restore saved position
  const saved = localStorage.getItem("footer-pos-" + id);
  if (saved) {
    const pos = JSON.parse(saved);
    icon.style.position = "absolute";
    icon.style.left = pos.x + "px";
    icon.style.top = pos.y + "px";
  }

  let offsetX = 0;
  let offsetY = 0;

  icon.addEventListener("mousedown", e => {
    if (!adminMode) return;

    icon.style.position = "absolute";

    offsetX = e.clientX - icon.offsetLeft;
    offsetY = e.clientY - icon.offsetTop;

    function move(e) {
      icon.style.left = e.clientX - offsetX + "px";
      icon.style.top = e.clientY - offsetY + "px";
    }

    function stop() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", stop);

      // Save position
      localStorage.setItem("footer-pos-" + id, JSON.stringify({
        x: icon.offsetLeft,
        y: icon.offsetTop
      }));
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stop);
  });
});

// BACK TO TOP
document.getElementById("back-to-top").onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
