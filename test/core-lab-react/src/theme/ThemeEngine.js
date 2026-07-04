export const themeEngine = {

  // PUBLIC toggle (header button)
  toggle() {
    const body = document.body;
    const current = body.getAttribute("data-theme");

    if (current === "day") {
      body.setAttribute("data-theme", "night");
      document.documentElement.style.setProperty(
        "--active-night-gradient",
        localStorage.getItem(`${window.__PAGE__}-nightTheme`)
      );
    } else {
      body.setAttribute("data-theme", "day");
      document.documentElement.style.setProperty(
        "--active-day-gradient",
        localStorage.getItem(`${window.__PAGE__}-dayTheme`)
      );
    }
  },

  // ADMIN: set day or night theme from swatch
  setBackgroundTheme(role, key) {
    const gradient = `var(--grad-${key})`;

    // Save per page
    localStorage.setItem(`${window.__PAGE__}-${role}Theme`, gradient);

    // Apply immediately
    if (role === "day") {
      document.documentElement.style.setProperty("--active-day-gradient", gradient);
    } else {
      document.documentElement.style.setProperty("--active-night-gradient", gradient);
    }
  },

  // Load saved theme when page loads
  loadPageTheme() {
    const day = localStorage.getItem(`${window.__PAGE__}-dayTheme`);
    const night = localStorage.getItem(`${window.__PAGE__}-nightTheme`);

    if (day) {
      document.documentElement.style.setProperty("--active-day-gradient", day);
    }
    if (night) {
      document.documentElement.style.setProperty("--active-night-gradient", night);
    }
  }
};
