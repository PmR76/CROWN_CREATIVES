/* TEST STATE */
window.initHeroCrown = function () {
  const day = document.getElementById("hero-crown-day");
  const night = document.getElementById("hero-crown-night");

  if (!day || !night) {
    console.warn("Hero Crown: crowns not found in DOM.");
    return;
  }

  function apply(theme) {
    if (theme === "dark") {
      day.style.opacity = "0";
      night.style.opacity = "1";
    } else {
      day.style.opacity = "1";
      night.style.opacity = "0";
    }
  }

  apply("day");

  document.addEventListener("theme-changed", e => apply(e.detail));

  day.style.pointerEvents = "none";
  night.style.pointerEvents = "none";

  console.info("Hero Crown Lab initialised.");
};

document.addEventListener("DOMContentLoaded", window.initHeroCrown);
