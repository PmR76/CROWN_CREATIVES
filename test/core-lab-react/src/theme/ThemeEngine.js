// src/theme/ThemeEngine.js

export const themeEngine = {
  // PUBLIC: header day/night toggle
  toggle() {
    const body = document.body;
    const current = body.getAttribute("data-theme") || "day";

    const page = window.__PAGE__ || "default";

    const dayGradient =
      localStorage.getItem(`${page}-dayTheme`) || `var(--grad-sunrise)`;
    const nightGradient =
      localStorage.getItem(`${page}-nightTheme`) || `var(--grad-midnight-indigo)`;

    if (current === "day") {
      body.setAttribute("data-theme", "night");
      document.documentElement.style.setProperty(
        "--active-night-gradient",
        nightGradient
      );
    } else {
      body.setAttribute("data-theme", "day");
      document.documentElement.style.setProperty(
        "--active-day-gradient",
        dayGradient
      );
    }
  },

  // ADMIN: set day or night theme from swatch
  setBackgroundTheme(role, key) {
    const page = window.__PAGE__ || "default";
    const gradient = `var(--grad-${key})`;

    // Save gradient and key per page
    localStorage.setItem(`${page}-${role}Theme`, gradient);
    localStorage.setItem(`${page}-${role}ThemeKey`, key);

    // Apply immediately
    if (role === "day") {
      document.documentElement.style.setProperty(
        "--active-day-gradient",
        gradient
      );
    } else {
      document.documentElement.style.setProperty(
        "--active-night-gradient",
        gradient
      );
    }
  },

  // Load saved theme when page loads
  loadPageTheme() {
    const page = window.__PAGE__ || "default";

    const day = localStorage.getItem(`${page}-dayTheme`);
    const night = localStorage.getItem(`${page}-nightTheme`);

    if (day) {
      document.documentElement.style.setProperty("--active-day-gradient", day);
    }
    if (night) {
      document.documentElement.style.setProperty(
        "--active-night-gradient",
        night
      );
    }

    // Sync with system dark mode (optional)
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const body = document.body;
    if (!body.getAttribute("data-theme")) {
      body.setAttribute("data-theme", prefersDark ? "night" : "day");
    }
  },

  // Random theme for current role
  setRandomTheme(role, keys) {
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    this.setBackgroundTheme(role, randomKey);
  }
};
