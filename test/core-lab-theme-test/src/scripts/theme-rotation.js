// ============================================================
// theme-rotation.js — Midnight Theme Auto-Rotation
// ============================================================

const DAY_KEY = "theme-day";
const NIGHT_KEY = "theme-night";

const daySwatches = [
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #ffe29f 0%, #ffa99f 48%, #ff719a 100%)",
  "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
  "linear-gradient(135deg, #ffdde1 0%, #ee9ca7 100%)",
  "linear-gradient(135deg, #c1dfc4 0%, #deecdd 100%)",
  "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
  "linear-gradient(135deg, #f6f0c4 0%, #f4d7a7 100%)",
  "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)",
  "linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)",
  "linear-gradient(135deg, #fffcdf 0%, #ffefc1 100%)",
  "linear-gradient(135deg, #ffe6fa 0%, #fcd1ff 100%)",
  "linear-gradient(135deg, #fff5f7 0%, #ffe3e9 100%)",
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  "linear-gradient(135deg, #fef9d7 0%, #f9d29d 100%)",
  "linear-gradient(135deg, #fffcf7 0%, #f3e7e9 100%)",
  "linear-gradient(135deg, #fffbd5 0%, #b20a2c 100%)",
  "linear-gradient(135deg, #ffefba 0%, #ffffff 100%)",
  "linear-gradient(135deg, #ffe8ec 0%, #f7d9e3 100%)",
  "linear-gradient(135deg, #fff7e5 0%, #ffd9a8 100%)",
  "linear-gradient(135deg, #ffe3e3 0%, #ffc9c9 100%)",
  "linear-gradient(135deg, #fff9e6 0%, #ffe7c4 100%)",
  "linear-gradient(135deg, #fef6ff 0%, #f7e8ff 100%)",
  "linear-gradient(135deg, #fff8f0 0%, #ffe4c4 100%)",
  "linear-gradient(135deg, #fdf6e3 0%, #fae1c2 100%)",
  "linear-gradient(135deg, #fff0f5 0%, #ffd6e8 100%)",
  "linear-gradient(135deg, #fffdf2 0%, #ffe9c7 100%)",
  "linear-gradient(135deg, #fff7fa 0%, #ffe3f2 100%)"
];

const nightSwatches = [
  "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
  "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
  "linear-gradient(135deg, #141e30 0%, #243b55 100%)",
  "linear-gradient(135deg, #000428 0%, #004e92 100%)",
  "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)",
  "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  "linear-gradient(135deg, #232526 0%, #414345 100%)",
  "linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)",
  "linear-gradient(135deg, #16222a 0%, #3a6073 100%)",
  "linear-gradient(135deg, #000000 0%, #434343 100%)",
  "linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%)",
  "linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)",
  "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)",
  "linear-gradient(135deg, #232526 0%, #414345 100%)",
  "linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)",
  "linear-gradient(135deg, #16222a 0%, #3a6073 100%)",
  "linear-gradient(135deg, #000000 0%, #434343 100%)",
  "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  "linear-gradient(135deg, #2d0b5a 0%, #642b73 100%)",
  "linear-gradient(135deg, #000000 0%, #0f2027 100%)",
  "linear-gradient(135deg, #1c1c33 0%, #3c3c66 100%)",
  "linear-gradient(135deg, #0a0a0f 0%, #1a1a2f 100%)",
  "linear-gradient(135deg, #1b1b2f 0%, #3d3d5c 100%)",
  "linear-gradient(135deg, #0d0d0d 0%, #2b2b2b 100%)",
  "linear-gradient(135deg, #1a0f2f 0%, #3a1f5f 100%)",
  "linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 100%)",
  "linear-gradient(135deg, #1a1a55 0%, #0f0f33 100%)",
  "linear-gradient(135deg, #0f2f2f 0%, #1a4f4f 100%)",
  "linear-gradient(135deg, #050510 0%, #1a1a2f 100%)"
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function scheduleMidnightRotation() {
  function rotateThemes() {
    const nextDay = pickRandom(daySwatches);
    const nextNight = pickRandom(nightSwatches);

    localStorage.setItem(DAY_KEY, nextDay);
    localStorage.setItem(NIGHT_KEY, nextNight);

    document.body.style.setProperty("--day-bg", nextDay);
    document.body.style.setProperty("--night-bg", nextNight);

    const current = document.body.dataset.theme || "day";
    if (current === "day") {
      document.body.style.background = nextDay;
    } else {
      document.body.style.background = nextNight;
    }
  }

  // Run once on load (optional)
  rotateThemes();

  // Schedule at local midnight
  const now = new Date();
  const nextMidnight = new Date();
  nextMidnight.setHours(24, 0, 0, 0);
  const msUntilMidnight = nextMidnight.getTime() - now.getTime();

  setTimeout(() => {
    rotateThemes();
    setInterval(rotateThemes, 24 * 60 * 60 * 1000);
  }, msUntilMidnight);
}
