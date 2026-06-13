window.initBackToTop = function () {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};
