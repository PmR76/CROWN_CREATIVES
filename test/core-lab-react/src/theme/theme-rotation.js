// ============================================================
// theme-rotation.js — Midnight Auto-Rotation + Gradient Swatches
// ============================================================

// ------------------------------------------------------------
// 1. Gradient Swatches (Day + Night)
// ------------------------------------------------------------

const gradients = [
  // DAY THEMES
  { id: "day-1",  preview: "linear-gradient(135deg, #ffecd2, #fcb69f)" },
  { id: "day-2",  preview: "linear-gradient(135deg, #f6d365, #fda085)" },
  { id: "day-3",  preview: "linear-gradient(135deg, #fdfbfb, #ebedee)" },
  { id: "day-4",  preview: "linear-gradient(135deg, #fff1eb, #ace0f9)" },
  { id: "day-5",  preview: "linear-gradient(135deg, #ff9a9e, #fecfef)" },
  { id: "day-6",  preview: "linear-gradient(135deg, #a1c4fd, #c2e9fb)" },
  { id: "day-7",  preview: "linear-gradient(135deg, #d4fc79, #96e6a1)" },
  { id: "day-8",  preview: "linear-gradient(135deg, #84fab0, #8fd3f4)" },
  { id: "day-9",  preview: "linear-gradient(135deg, #fccb90, #d57eeb)" },
  { id: "day-10", preview: "linear-gradient(135deg, #f3e7e9, #e3eeff)" },

  // NIGHT THEMES
  { id: "night-1",  preview: "linear-gradient(135deg, #2c3e50, #4ca1af)" },
  { id: "night-2",  preview: "linear-gradient(135deg, #141e30, #243b55)" },
  { id: "night-3",  preview: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)" },
  { id: "night-4",  preview: "linear-gradient(135deg, #232526, #414345)" },
  { id: "night-5",  preview: "linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b)" },
  { id: "night-6",  preview: "linear-gradient(135deg, #000428, #004e92)" },
  { id: "night-7",  preview: "linear-gradient(135deg, #1f1c2c, #928dab)" },
  { id: "night-8",  preview: "linear-gradient(135deg, #2b5876, #4e4376)" },
  { id: "night-9",  preview: "linear-gradient(135deg, #1e3c72, #2a5298)" },
  { id: "night-10", preview: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" }
];

// ------------------------------------------------------------
// 2. Midnight Auto-Rotation (your original logic)
// ------------------------------------------------------------

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

// ------------------------------------------------------------
// 3. Default Export (required by Home.jsx)
// ------------------------------------------------------------

export default gradients;
