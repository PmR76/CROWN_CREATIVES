window.initBackToTop = function () {
  requestAnimationFrame(() => {
    const btn = document.getElementById("backToTop");
    if (!btn) return;

    // Prevent double-binding
    if (btn.dataset.bound === "1") return;
    btn.dataset.bound = "1";

    // Remove previous listeners
    const clone = btn.cloneNode(true);
    btn.parentNode.replaceChild(clone, btn);

    clone.addEventListener("click", () => {
      document.scrollingElement.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  });
};
