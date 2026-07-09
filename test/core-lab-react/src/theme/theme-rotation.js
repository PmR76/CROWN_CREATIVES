// ============================================================
// theme-rotation.js — Final Midnight Theme Auto-Rotation
// ============================================================

const DAY_KEY = "theme-day";
const NIGHT_KEY = "theme-night";

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function scheduleMidnightRotation() {
  function rotateThemes() {
    const day = localStorage.getItem(DAY_KEY);
    const night = localStorage.getItem(NIGHT_KEY);

    if (day) document.body.style.setProperty("--day-bg", day);
    if (night) document.body.style.setProperty("--night-bg", night);

    const current = document.body.dataset.theme || "day";

    if (current === "day" && day) {
      document.body.style.background = day;
    }
    if (current === "night" && night) {
      document.body.style.background = night;
    }
  }

  // Run once on load
  rotateThemes();

  // Schedule at local midnight
  const now = new Date();
  const nextMidnight = new Date();
  nextMidnight.setHours(24, 0, 0, 0);

  const msUntilMidnight = nextMidnight - now;

  setTimeout(() => {
    rotateThemes();
    setInterval(rotateThemes, 24 * 60 * 60 * 1000);
  }, msUntilMidnight);
}
