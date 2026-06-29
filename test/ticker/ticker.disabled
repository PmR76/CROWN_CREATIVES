/* ============================================================
   CROWN CREATIVES — TICKER ENGINE (Admin‑Ready Build)
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------------------------------------
     BASIC TICKER (core-lab + public site)
  ------------------------------------------------------------ */

  const track = document.querySelector(".ticker-track");
  if (!track) {
    console.warn("Ticker: .ticker-track not found");
    return; // core-lab only → stop here
  }

  /* ------------------------------------------------------------
     ADMIN TICKER (ticker-lab only)
     Only runs if admin HTML exists
  ------------------------------------------------------------ */

  const container = document.getElementById("ticker-container");
  const text = document.getElementById("ticker-text");

  // If admin elements don't exist, skip admin engine entirely
  if (!container || !text) {
    console.warn("Ticker Admin Mode: admin elements not found — skipping admin engine.");
    return;
  }

  let speed = parseInt(localStorage.getItem("cc-ticker-speed") || "18", 10);

  function applySpeed() {
    if (text) {
      text.style.animationDuration = `${speed}s`;
    }
  }

  applySpeed();

  function loadPosition() {
    const saved = localStorage.getItem("cc-ticker-pos");
    if (!container || !saved) return;

    const pos = JSON.parse(saved);
    container.style.position = "absolute";
    container.style.left = pos.left;
    container.style.top = pos.top;
  }

  loadPosition();

  function savePosition() {
    if (!container) return;
    const pos = {
      left: container.style.left,
      top: container.style.top
    };
    localStorage.setItem("cc-ticker-pos", JSON.stringify(pos));
  }

  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  document.addEventListener("mousedown", (e) => {
    if (!document.body.classList.contains("admin-mode")) return;
    if (!container.contains(e.target)) return;

    dragging = true;

    const rect = container.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    container.style.position = "absolute";
    container.style.zIndex = "9999";

    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;

    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
  });

  document.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;
    savePosition();
  });

  function enableEdit() {
    text.contentEditable = "true";
    text.classList.add("ticker-editing");
  }

  function disableEdit() {
    text.contentEditable = "false";
    text.classList.remove("ticker-editing");
    localStorage.setItem("cc-ticker-text", text.innerText);
  }

  const savedText = localStorage.getItem("cc-ticker-text");
  if (savedText) text.innerText = savedText;

  function enableSpeedMode() {
    document.body.classList.add("ticker-speed-mode");
  }

  function disableSpeedMode() {
    document.body.classList.remove("ticker-speed-mode");
  }

  document.addEventListener("wheel", (e) => {
    if (!document.body.classList.contains("ticker-speed-mode")) return;

    if (e.deltaY < 0) speed = Math.max(6, speed - 1);
    if (e.deltaY > 0) speed = Math.min(40, speed + 1);

    localStorage.setItem("cc-ticker-speed", speed);
    applySpeed();
  });

  function resetTicker() {
    text.innerText = "Welcome to Crown Creatives — Creativity Without Limits.";
    localStorage.removeItem("cc-ticker-text");

    speed = 18;
    localStorage.removeItem("cc-ticker-speed");
    applySpeed();

    container.style.left = "";
    container.style.top = "";
    localStorage.removeItem("cc-ticker-pos");
  }

  window.CC = window.CC || {};
  CC.ticker = {
    enableEdit,
    disableEdit,
    enableSpeedMode,
    disableSpeedMode,
    reset: resetTicker
  };

});
