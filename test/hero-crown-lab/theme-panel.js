/* ============================================================
   ADMIN‑ONLY ACCESS (PASSWORD + REMEMBER DEVICE)
============================================================ */

let isAdmin = false;

// Auto‑unlock if this laptop already authenticated
if (localStorage.getItem("cc-admin") === "true") {
  isAdmin = true;
}

document.addEventListener("DOMContentLoaded", () => {
  const ts = document.getElementById("theme-panel-timestamp");
  if (ts) {
    ts.textContent = "Loaded: " + new Date().toLocaleString();
  }
  console.log("Theme Panel JS Loaded:", new Date().toLocaleString());
});

// Ask for password on Shift+T
window.addEventListener("keydown", e => {
  if (e.key === "T" && e.shiftKey) {
    console.log("SHIFT+T pressed — admin:", isAdmin);

    if (!isAdmin) {
      const pass = prompt("Enter admin password:");
      if (pass === "CROWN2026") {
        isAdmin = true;
        localStorage.setItem("cc-admin", "true");
        alert("Admin mode unlocked");
      } else {
        return; // wrong password → do nothing
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

(function () {
  const panel = document.getElementById("theme-panel");
  const header = document.getElementById("theme-panel-header");
  const closeBtn = document.getElementById("theme-panel-close");

  if (!panel || !header || !closeBtn) return;

  // Close button
  closeBtn.addEventListener("click", () => {
    panel.classList.remove("theme-panel-visible");
  });

  // DRAGGING
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
})();


/* ============================================================
   GRADIENT ENGINE — DAY + NIGHT SELECTORS
============================================================ */

(function () {
  // Load saved gradients
  let savedDay = localStorage.getItem("cc-day-gradient") || "sunrise";
  let savedNight = localStorage.getItem("cc-night-gradient") || "midnight-indigo";

  // Apply saved gradients to CSS variables
  document.documentElement.style.setProperty(
    "--active-day-gradient",
    `var(--grad-${savedDay})`
  );

  document.documentElement.style.setProperty(
    "--active-night-gradient",
    `var(--grad-${savedNight})`
  );

  // Highlight selected swatches
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

  // Handle swatch clicks
  document.querySelectorAll(".theme-swatch").forEach(swatch => {
    swatch.addEventListener("click", () => {
      const role = swatch.dataset.role; // "day" or "night"
      const key = swatch.dataset.key;   // gradient key

      if (role === "day") {
        savedDay = key;
        localStorage.setItem("cc-day-gradient", key);
        document.documentElement.style.setProperty(
          "--active-day-gradient",
          `var(--grad-${key})`
        );
      }

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
})();
