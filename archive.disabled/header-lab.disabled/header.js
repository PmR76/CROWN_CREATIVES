document.addEventListener("DOMContentLoaded", () => {

  // Theme Engine
  if (typeof window.initThemeEngine === "function") {
    window.initThemeEngine();
  }

  // Sound Engine
  if (typeof window.initSoundEngine === "function") {
    window.initSoundEngine();
  }

  console.log("Header test harness initialised.");
});
