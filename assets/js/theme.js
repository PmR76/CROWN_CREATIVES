// ===============================
//  Crown Creatives Theme Engine
// ===============================

// DOM elements
const body = document.body;
const toggleBtn = document.getElementById("themeToggle");
const toggleIcon = document.querySelector(".animated-toggle-icon");

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

  // SINGLE MODE CLASS
  body.classList.toggle("dark-mode", isNight);

  // Apply .night class to SVG icon
  if (toggleIcon) {
    toggleIcon.classList.toggle("night", isNight);
  }

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
    const newTheme = body.classList.contains("dark-mode") ? "day" : "night";
    localStorage.setItem("cc-theme", newTheme);
    applyTheme(newTheme);
  });
}

// PAGE FADE-IN
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
});

// LIGHT SWEEP ON LOAD
window.addEventListener("load", () => {
  const sweep = document.createElement("div");
  sweep.className = "page-sweep";
  document.body.appendChild(sweep);
});

// SCROLL REVEAL ENGINE
const revealElements = document.querySelectorAll(
  ".scroll-reveal, .scroll-drift, .scroll-glow"
);

function revealOnScroll() {
  const trigger = window.innerHeight * 0.85;

  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < trigger) {
      el.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
