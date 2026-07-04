/* ============================================================
   THEME PANEL — FINAL CLEAN VERSION
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  console.log("Theme Panel JS Loaded:", new Date().toLocaleString());

  /* ============================================================
     ADMIN‑ONLY ACCESS (PASSWORD + REMEMBER DEVICE)
  ============================================================ */

  let isAdmin = localStorage.getItem("cc-admin") === "true";

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
     LOAD SAVED SETTINGS FIRST
  ============================================================ */

  let savedDay = localStorage.getItem("cc-day-gradient") || "sunrise";
  let savedNight = localStorage.getItem("cc-night-gradient") || "midnight-indigo";

  const savedSettings = localStorage.getItem("cc-theme-settings");

  if (savedSettings) {
    const s = JSON.parse(savedSettings);

    if (s.day) {
      savedDay = s.day;
      localStorage.setItem("cc-day-gradient", s.day);
    }

    if (s.night) {
      savedNight = s.night;
      localStorage.setItem("cc-night-gradient", s.night);
    }

    if (s.mode === "dark") {
      document.body.classList.add("dark-mode");
    }

    if (s.panelX && s.panelY) {
      panel.style.left = s.panelX;
      panel.style.top = s.panelY;
    }

    console.log("✔ Loaded saved theme settings");
  }

  /* ============================================================
     APPLY ACTIVE GRADIENTS
  ============================================================ */

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
     SWATCH CLICK HANDLERS — CLEAN + GLOW ENABLED
  ============================================================ */

  document.querySelectorAll(".theme-swatch").forEach(swatch => {

    swatch.addEventListener("click", () => {

      const role = swatch.dataset.role;
      const key = swatch.dataset.key;

      /* GLOW COLOR */
      document.documentElement.style.setProperty(
        "--crown-glow-color",
        `var(--glow-${key})`
      );

      /* APPLY DAY THEME */
      if (role === "day") {
        savedDay = key;
        localStorage.setItem("cc-day-gradient", key);

        document.documentElement.style.setProperty(
          "--active-day-gradient",
          `var(--grad-${key})`
        );
      }

      /* APPLY NIGHT THEME */
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


  /* ============================================================
     TOOL BUTTONS — VERIFY + SAVE
  ============================================================ */

  const verifyBtn = document.getElementById("verify-swatches-btn");
  const saveBtn = document.getElementById("save-theme-settings-btn");

  if (verifyBtn) {
    verifyBtn.addEventListener("click", () => {
      verifySwatches();
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const settings = {
        day: savedDay,
        night: savedNight,
        mode: localStorage.getItem("cc-mode"),
        panelX: panel.style.left,
        panelY: panel.style.top
      };

      localStorage.setItem("cc-theme-settings", JSON.stringify(settings));

      console.log("✔ Theme settings saved:", settings);
      alert("Theme settings saved");
    });
  }

}); // END DOMContentLoaded


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
      swatch.style.outline = "none";
    }
  });

  console.groupEnd();
};
