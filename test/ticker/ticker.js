/* ============================================================
   EVOLVE OS — MAGICAL TICKER JS v3.1
   Draggable + persistent position
   ============================================================ */

window.initEvolveTicker = () => {
  const ticker = document.getElementById("evolveTicker");
  if (!ticker) return;

  // Restore saved position
  const savedX = localStorage.getItem("tickerX");
  const savedY = localStorage.getItem("tickerY");
  if (savedX && savedY) {
    ticker.style.left = savedX + "px";
    ticker.style.top = savedY + "px";
    ticker.style.transform = "translate(0,0)";
    ticker.style.position = "fixed";
  }

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  ticker.addEventListener("mousedown", (e) => {
    isDragging = true;
    ticker.classList.add("is-dragging");

    offsetX = e.clientX - ticker.offsetLeft;
    offsetY = e.clientY - ticker.offsetTop;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    ticker.style.left = (e.clientX - offsetX) + "px";
    ticker.style.top = (e.clientY - offsetY) + "px";
    ticker.style.transform = "translate(0,0)";
    ticker.style.position = "fixed";
  });

  window.addEventListener("mouseup", () => {
    if (!isDragging) return;

    isDragging = false;
    ticker.classList.remove("is-dragging");

    // Save position
    localStorage.setItem("tickerX", ticker.offsetLeft);
    localStorage.setItem("tickerY", ticker.offsetTop);
  });
};
