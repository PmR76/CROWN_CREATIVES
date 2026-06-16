/* ============================================================
   HERO CROWN MODULE — FULL FILE (v=20240614-1210)
   Ensures perfect centering + fade sync
============================================================ */

window.addEventListener("DOMContentLoaded", () => {
  const dayCrown = document.querySelector(".crown-day");
  const nightCrown = document.querySelector(".crown-night");

  if (!dayCrown || !nightCrown) return;

  // Hard‑lock positioning
  const lockPosition = crown => {
    crown.style.top = "0";
    crown.style.left = "50%";
    crown.style.transform = "translateX(-50%)";
  };

  lockPosition(dayCrown);
  lockPosition(nightCrown);

  // Ensure night crown starts hidden
  nightCrown.style.opacity = "0";
});
