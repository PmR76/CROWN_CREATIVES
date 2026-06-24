window.initHeroCrown = function () {
  const day = document.getElementById("hero-crown-day");
  const night = document.getElementById("hero-crown-night");

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
};

document.addEventListener("DOMContentLoaded", window.initHeroCrown);
