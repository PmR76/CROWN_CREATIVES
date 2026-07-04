// ../ticker-lab/ticker.js
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".ticker-track");

  if (!track) {
    console.warn("Ticker: .ticker-track not found — ticker disabled.");
    return;
  }

  track.style.whiteSpace = "nowrap";
  track.style.display = "inline-block";
  track.style.animation = "ticker-scroll 18s linear infinite";
});
