/* ============================================================
   CROWN CREATIVES — FOOTER ENGINE (Unified Clean Build)
   - Back-to-top button
   - Social icon click handlers
   - No admin mode
   - No dragging
   - No CC.drag usage
============================================================ */

(function () {

  /* ------------------------------------------------------------
     1. BACK TO TOP BUTTON
  ------------------------------------------------------------ */
  const backToTop = document.getElementById("back-to-top");

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ------------------------------------------------------------
     2. SOCIAL ICON CLICK HANDLERS
  ------------------------------------------------------------ */
  const icons = document.querySelectorAll(".footer-icon");

  icons.forEach(icon => {
    const id = icon.dataset.id;
    icon.style.cursor = "pointer";

    icon.addEventListener("click", () => {
      switch (id) {

        case "facebook":
          window.open("https://facebook.com/people/Crown-Creatives/61556386467490", "_blank");
          break;

        case "instagram":
          window.open("https://instagram.com/crown_creatives_uk", "_blank");
          break;

        case "email":
          window.location.href = "mailto:hello@crowncreatives.uk";
          break;

        case "copilot":
          window.open("https://www.microsoft.com/en-us/microsoft-copilot", "_blank");
          break;

        default:
          console.log("Unknown footer icon:", id);
      }
    });
  });

})();
