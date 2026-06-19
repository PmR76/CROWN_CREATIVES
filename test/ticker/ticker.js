/* ================================
   TICKER MODULE — FINAL VERSION
   ================================ */

/* ELEMENTS */
const container = document.getElementById("ticker-container");
const line1 = document.getElementById("ticker-text-1") || document.getElementById("ticker-text");
const line2 = document.getElementById("ticker-text-2");

/* STATE */
let tickerAdmin = false;   // <— FIXED: unique admin flag
let dragging = false;
let offsetX = 0;
let offsetY = 0;
let speed = 18; // default animation duration in seconds


/* ================================
   LOAD SAVED TICKER TEXT
   ================================ */
const savedTicker = localStorage.getItem("cc-ticker-text");
if (savedTicker) {
  line1.innerText = savedTicker;
  if (line2) line2.innerText = savedTicker;
}


/* ================================
   ADMIN MODE TOGGLE — SHIFT + A
   ================================ */
document.addEventListener("keydown", (e) => {
  if (e.shiftKey && e.key.toLowerCase() === "a") {
    tickerAdmin = !tickerAdmin;
    document.body.classList.toggle("admin-active", tickerAdmin);

    if (tickerAdmin) {
      line1.contentEditable = "true";
      line1.classList.add("glow");
      if (line2) line2.classList.add("glow");
    } else {
      line1.contentEditable = "false";
      line1.classList.remove("glow");
      if (line2) line2.classList.remove("glow");
    }
  }
});


/* ================================
   SAVE TICKER TEXT — SHIFT + S
   ================================ */
document.addEventListener("keydown", (e) => {
  if (tickerAdmin && e.shiftKey && e.key.toLowerCase() === "s") {
    localStorage.setItem("cc-ticker-text", line1.innerText);

    line1.classList.add("glow");
    if (line2) line2.classList.add("glow");

    setTimeout(() => {
      line1.classList.remove("glow");
      if (line2) line2.classList.remove("glow");
    }, 600);
  }
});


/* ================================
   SYNC TEXT (FOR DUAL-LINE MODE)
   ================================ */
document.addEventListener("input", () => {
  if (tickerAdmin && line2) {
    line2.innerText = line1.innerText;
  }
});


/* ================================
   DRAGGING (ADMIN MODE ONLY)
   ================================ */
container.addEventListener("mousedown", (e) => {
  if (!tickerAdmin) return;

  dragging = true;
  offsetX = e.clientX - container.offsetLeft;
  offsetY = e.clientY - container.offsetTop;
  container.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
  if (!dragging) return;

  container.style.left = `${e.clientX - offsetX}px`;
  container.style.top = `${e.clientY - offsetY}px`;
});

document.addEventListener("mouseup", () => {
  dragging = false;
  container.style.cursor = "grab";
});


/* ================================
   SPEED CONTROL — SHIFT + SCROLL
   ================================ */
function updateSpeed() {
  line1.style.animationDuration = `${speed}s`;
  if (line2) line2.style.animationDuration = `${speed}s`;
}

document.addEventListener("wheel", (e) => {
  if (!tickerAdmin) return;

  if (e.deltaY < 0) speed = Math.max(6, speed - 1);   // faster
  if (e.deltaY > 0) speed = Math.min(40, speed + 1);  // slower

  updateSpeed();
});
