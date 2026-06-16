window.initBackToTop = function () {
  // Wait for DOM injection
  requestAnimationFrame(() => {
    const btn = document.getElementById("backToTop");
    if (!btn) return;

    // Remove any previous listeners
    const clone = btn.cloneNode(true);
    btn.parentNode.replaceChild(clone, btn);

    clone.addEventListener("click", () => {
    document.scrollingElement.scrollTo({ top: 0, behavior: "smooth" });

    });
  });
};
