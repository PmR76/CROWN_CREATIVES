/* ============================================================
   CROWN CREATIVES — CORE-LAB TICKER (Safe Build)
   No admin engine, no null errors, no dependencies
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  const track = document.querySelector(".ticker-track");

  if (!track) {
    console.warn("Ticker: .ticker-track not found — ticker disabled.");
    return;
  }

  // Apply animation safely
  track.style.whiteSpace = "nowrap";
  track.style.display = "inline-block";
  track.style.animation = "ticker-scroll 18s linear infinite";

});
