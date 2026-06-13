window.initBackToTop = function () {
  // Wait for DOM injection
  requestAnimationFrame(() => {
    const btn = document.getElementById("backToTop");
    if (!btn) return;

    // Remove any previous listeners (prevents duplicates)
    btn.replaceWith(btn.cloneNode(true));
    const newBtn = document.getElementById("backToTop");

    newBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
};
