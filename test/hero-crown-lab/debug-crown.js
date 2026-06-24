document.addEventListener("DOMContentLoaded", () => {

  console.log("=== CROWN LAB DIAGNOSTICS START ===");

  // 1. Check CSS files
  console.log("CSS Loaded:");
  [...document.styleSheets].forEach(sheet => {
    console.log(" -", sheet.href || "(inline)");
  });

  // 2. Check JS files
  console.log("JS Loaded:");
  [...document.scripts].forEach(script => {
    console.log(" -", script.src || "(inline)");
  });

  // 3. Check panel existence
  const panel = document.getElementById("theme-panel");
  console.log("Panel exists:", !!panel);

  // 4. Check swatches
  const swatches = document.querySelectorAll(".theme-swatch");
  console.log("Swatch count:", swatches.length);

  // 5. Check if swatches are inside the panel
  const swatchesInside = panel ? panel.querySelectorAll(".theme-swatch").length : 0;
  console.log("Swatches inside panel:", swatchesInside);

  // 6. Check click listeners
  swatches.forEach((swatch, i) => {
    const listeners = getEventListeners(swatch);
    console.log(`Swatch ${i} listeners:`, listeners.click || []);
  });

  // 7. Check active gradients
  console.log("Active day gradient:", getComputedStyle(document.documentElement).getPropertyValue("--active-day-gradient"));
  console.log("Active night gradient:", getComputedStyle(document.documentElement).getPropertyValue("--active-night-gradient"));

  // 8. Check panel visibility
  console.log("Panel visible:", panel?.classList.contains("theme-panel-visible"));

  console.log("=== CROWN LAB DIAGNOSTICS END ===");

});
