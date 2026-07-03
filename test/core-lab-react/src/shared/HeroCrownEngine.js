// HERO CROWN ENGINE — shared between React + Lab

export function initHeroCrown(root = document) {
  const day = root.getElementById("hero-crown-day");
  const night = root.getElementById("hero-crown-night");

  if (!day || !night) {
    console.warn("HeroCrownEngine: missing crown images.");
    return;
  }

  // Listen for theme-changed events (from useThemeEngine or lab harness)
  root.addEventListener("theme-changed", e => {
    const theme = e.detail;
    if (theme === "dark") {
      day.style.opacity = "0";
      night.style.opacity = "1";
    } else {
      day.style.opacity = "1";
      night.style.opacity = "0";
    }
  });
}
