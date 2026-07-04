console.log("[EVOLVE] OS Entry module loaded");

window.addEventListener("EVOLVE_DOUBLE_TAP", () => {
  const dash = document.querySelector(".os-window");
  if (!dash) return;

  dash.classList.add("os-window-active");
  dash.style.transform = "scale(1)";
  dash.style.opacity = "1";

  const hints = document.getElementById("hints-panel");
  if (hints) {
    hints.classList.add("card-glow-strong");
    setTimeout(() => hints.classList.remove("card-glow-strong"), 500);
  }

  console.log("[EVOLVE] Dashboard brought to front");
});
