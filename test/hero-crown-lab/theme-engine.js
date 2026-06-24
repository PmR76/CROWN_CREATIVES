(function () {
  const toggle = document.getElementById("themeToggle");

  function applyTheme(mode) {
    if (mode === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    document.dispatchEvent(new CustomEvent("theme-changed", { detail: mode }));
  }

  // Initial
  applyTheme("day");

  toggle.addEventListener("click", () => {
    const next = document.body.classList.contains("dark-mode") ? "day" : "dark";
    applyTheme(next);
  });
})();
