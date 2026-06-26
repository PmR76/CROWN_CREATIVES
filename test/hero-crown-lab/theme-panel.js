/* ============================================================
   THEME PANEL — FINAL CLEAN VERSION
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  console.log("Theme Panel JS Loaded:", new Date().toLocaleString());

  /* ============================================================
     ADMIN‑ONLY ACCESS (PASSWORD + REMEMBER DEVICE)
  ============================================================ */

  let isAdmin = false;

  if (localStorage.getItem("cc-admin") === "true") {
    isAdmin = true;
  }

  const ts = document.getElementById("theme-panel-timestamp");
  if (ts) ts.textContent = "Loaded: " + new Date().toLocaleString();

  window.addEventListener("keydown", e => {
    console.log("Key pressed:", e.key, "Shift:", e.shiftKey, "Admin:", isAdmin);

    if (e.key === "T" && e.shiftKey) {

      if (!isAdmin) {
        const pass = prompt("Enter admin password:");
        if (pass === "CROWN2026") {
          isAdmin = true;
          localStorage.setItem("cc-admin", "true");
          alert("Admin mode unlocked");
        } else {
          return;
        }
      }

      const panel = document.getElementById("theme-panel");
      if (panel) {
        panel.classList.toggle("theme-panel-visible");
      }
    }
  });


  /* ============================================================
     PANEL LOGIC (DRAGGING + CLOSE BUTTON)
  ============================================================ */

  const panel = document.getElementById("theme-panel");
  const header = document.getElementById("theme-panel-header");
  const closeBtn = document.getElementById("theme-panel-close");

  if (panel && header && closeBtn) {

    closeBtn.addEventListener("click", () => {
      panel.classList.remove("theme-panel-visible");
    });

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener("mousedown", e => {
      isDragging = true;
      offsetX = e.clientX - panel.offsetLeft;
      offsetY = e.clientY - panel.offsetTop;
      panel.classList.add("theme-panel-dragging");
    });

    window.addEventListener("mousemove", e => {
      if (isDragging) {
        panel.style.left = `${e.clientX - offsetX}px`;
        panel.style.top = `${e.clientY - offsetY}px`;
      }
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
      panel.classList.remove("theme-panel-dragging");
    });
  }


  /* ============================================================
     GRADIENT ENGINE — LOAD SAVED DAY/NIGHT THEMES
  ============================================================ */

  let savedDay = localStorage.getItem("cc-day-gradient") || "sunrise";
  let savedNight = localStorage.getItem("cc-night-gradient") || "midnight-indigo";

  document.documentElement.style.setProperty(
    "--active-day-gradient",
    `var(--grad-${savedDay})`
  );

  document.documentElement.style.setProperty(
    "--active-night-gradient",
    `var(--grad-${savedNight})`
  );

  /* ============================================================
     HIGHLIGHT CURRENTLY SELECTED SWATCHES
  ============================================================ */

  function highlightSelected() {
    document.querySelectorAll(".theme-swatch").forEach(s => {
      s.classList.remove("selected");
    });

    document
      .querySelectorAll(`.theme-swatch[data-role="day"][data-key="${savedDay}"]`)
      .forEach(s => s.classList.add("selected"));

    document
      .querySelectorAll(`.theme-swatch[data-role="night"][data-key="${savedNight}"]`)
      .forEach(s => s.classList.add("selected"));
  }

  highlightSelected();


  /* ============================================================
     SWATCH CLICK HANDLERS — CLEAN + CORRECT + GLOW ENABLED
  ============================================================ */

  document.querySelectorAll(".theme-swatch").forEach(swatch => {

    swatch.addEventListener("click", () => {

      const role = swatch.dataset.role;
      const key = swatch.dataset.key;

      /* -----------------------------------------
         THEME‑SPECIFIC GLOW COLOR
      ----------------------------------------- */
      document.documentElement.style.setProperty(
        "--crown-glow-color",
        `var(--glow-${key})`
      );

      /* -----------------------------------------
         APPLY DAY THEME
      ----------------------------------------- */
      if (role === "day") {
        savedDay = key;
        localStorage.setItem("cc-day-gradient", key);

        document.documentElement.style.setProperty(
          "--active-day-gradient",
          `var(--grad-${key})`
        );
      }

      /* -----------------------------------------
         APPLY NIGHT THEME
      ----------------------------------------- */
      if (role === "night") {
        savedNight = key;
        localStorage.setItem("cc-night-gradient", key);

        document.documentElement.style.setProperty(
          "--active-night-gradient",
          `var(--grad-${key})`
        );
      }

      highlightSelected();
    });
  });

});
/* ============================================================
   DEBUG: VERIFY SWATCHES + CSS VARIABLES
============================================================ */

window.verifySwatches = function () {
  console.group("Theme Panel Verification");

  document.querySelectorAll(".theme-swatch").forEach(swatch => {
    const key = swatch.dataset.key;
    const cssVar = `--grad-${key}`;
    const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
    const bg = getComputedStyle(swatch).backgroundImage;

    if (!value) {
      console.warn(`❌ Missing CSS variable: ${cssVar}`);
      swatch.style.outline = "3px solid red";
    } else if (!bg || bg === "none") {
      console.warn(`❌ Swatch has no background: ${key}`);
      swatch.style.outline = "3px solid yellow";
    } else {
      console.log(`✔ ${key} OK`);
    }
  });

  console.groupEnd();
};
document.getElementById("verify-swatches-btn").addEventListener("click", () => {
  verifySwatches();
});
