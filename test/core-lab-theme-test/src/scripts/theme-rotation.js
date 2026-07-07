/* ============================================================
   Automatic Midnight Theme Rotation
   ============================================================ */

/* Import gradient libraries from ThemePanel.jsx */
import { daySwatches, nightSwatches } from "../components/ThemePanel.jsx";

/* ============================================================
   Apply random day + night themes
   ============================================================ */
function applyRandomThemes() {
  const day = daySwatches[Math.floor(Math.random() * daySwatches.length)];
  const night = nightSwatches[Math.floor(Math.random() * nightSwatches.length)];

  localStorage.setItem("theme-day", day);
  localStorage.setItem("theme-dark", night);

  const current = document.body.dataset.theme || "day";
  document.body.style.background = current === "day" ? day : night;
}

/* ============================================================
   Schedule midnight theme change
   ============================================================ */
function scheduleMidnightThemeChange() {
  const now = new Date();
  const midnight = new Date();

  midnight.setHours(24, 0, 0, 0);

  const msUntilMidnight = midnight - now;

  setTimeout(() => {
    applyRandomThemes();
    scheduleMidnightThemeChange(); // reschedule next midnight
  }, msUntilMidnight);
}

/* ============================================================
   Start rotation engine
   ============================================================ */
scheduleMidnightThemeChange();
