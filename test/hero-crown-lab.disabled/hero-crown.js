// ============================================================
// Hero Crown Engine — Fade transition between day/night crowns
// ============================================================

export function initHeroCrown() {
  const day = document.getElementById("hero-crown-day");
  const night = document.getElementById("hero-crown-night");

  if (!day || !night) return;

  // Initial state
  const theme = document.body.getAttribute("data-theme") || "day";
  if (theme === "day") {
    day.classList.add("visible");
    night.classList.remove("visible");
  } else {
    day.classList.remove("visible");
    night.classList.add("visible");
  }
}
