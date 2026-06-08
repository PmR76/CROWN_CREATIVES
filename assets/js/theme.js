// ===============================
//  Crown Creatives Theme Engine
// ===============================

// DOM elements
const body = document.body;
const toggleBtn = document.getElementById("themeToggle");

const dayBg = document.querySelector(".day-background");
const nightBg = document.querySelector(".night-background");

const dayClouds = document.querySelector(".day-clouds");
const nightNebula = document.querySelector(".night-nebula");

const crownDay = document.querySelector(".crown-day");
const crownNight = document.querySelector(".crown-night");

// -------------------------------
//  Apply theme instantly on load
// -------------------------------
function applyTheme(theme) {
  const isNight = theme === "night";

  body.classList.toggle("night-mode", isNight);

  if (dayBg) dayBg.style.opacity = isNight ? "0" : "1";
  if (nightBg) nightBg.style.opacity = isNight ? "1" : "0";

  if (dayClouds) dayClouds.style.opacity = isNight ? "0" : "1";
  if (nightNebula) nightNebula.style.opacity = isNight ? "1" : "0";

  if (crownDay) crownDay.style.opacity = isNight ? "0" : "1";
  if (crownNight) crownNight.style.opacity = isNight ? "1" : "0";
}

// -------------------------------
//  Load saved theme
// -------------------------------
const savedTheme = localStorage.getItem("cc-theme") || "day";
applyTheme(savedTheme);

// -------------------------------
//  Toggle theme on click
// -------------------------------
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const newTheme = body.classList.contains("night-mode") ? "day" : "night";
    localStorage.setItem("cc-theme", newTheme);
    applyTheme(newTheme);
  });
}
