const ticker = document.getElementById("ticker-text");
const container = document.getElementById("ticker-container");

let adminMode = false;
let dragging = false;
let offsetX = 0;
let offsetY = 0;

/* TOGGLE ADMIN MODE — SHIFT + A */
document.addEventListener("keydown", (e) => {
  if (e.shiftKey && e.key.toLowerCase() === "a") {
    adminMode = !adminMode;
    document.body.classList.toggle("admin-active", adminMode);

    if (adminMode) {
      ticker.contentEditable = "true";
      ticker.classList.add("glow");
    } else {
      ticker.contentEditable = "false";
      ticker.classList.remove("glow");
    }
  }
});

/* DRAGGING */
container.addEventListener("mousedown", (e) => {
  if (!adminMode) return;
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
/* LOAD SAVED TICKER TEXT */
const savedTicker = localStorage.getItem("cc-ticker-text");
if (savedTicker) {
  ticker.innerText = savedTicker;
}

/* SAVE TICKER TEXT — SHIFT + S */
document.addEventListener("keydown", (e) => {
  if (adminMode && e.shiftKey && e.key.toLowerCase() === "s") {
    localStorage.setItem("cc-ticker-text", ticker.innerText);
    ticker.classList.add("glow");
    setTimeout(() => ticker.classList.remove("glow"), 600);
  }
});
