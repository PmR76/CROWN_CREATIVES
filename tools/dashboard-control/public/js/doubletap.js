let lastTap = 0;
const DOUBLE_TAP_THRESHOLD = 280; // ms

function handleDoubleTap() {
  console.log("[EVOLVE] Double‑tap detected → Launching OS Entry");
  window.dispatchEvent(new CustomEvent("EVOLVE_DOUBLE_TAP"));
}

window.addEventListener("pointerdown", () => {
  const now = Date.now();
  if (now - lastTap < DOUBLE_TAP_THRESHOLD) {
    handleDoubleTap();
  }
  lastTap = now;
});
