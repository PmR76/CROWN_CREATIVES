/* ============================================================
   CROWN CREATIVES — DRAGGABLE MAGIC CARDS v3.0
   ============================================================ */

window.initMagicCards = () => {
  const cards = document.querySelectorAll(".magic-card");
  if (!cards.length) return;

  cards.forEach(card => {
    const key = "card-pos-" + card.dataset.card;

    // Restore saved position
    const saved = localStorage.getItem(key);
    if (saved) {
      const pos = JSON.parse(saved);
      card.style.position = "absolute";
      card.style.left = pos.x + "px";
      card.style.top = pos.y + "px";
    }

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    card.addEventListener("mousedown", e => {
      dragging = true;
      card.classList.add("dragging");

      offsetX = e.clientX - card.offsetLeft;
      offsetY = e.clientY - card.offsetTop;

      card.style.position = "absolute";
      card.style.zIndex = 9999;
    });

    window.addEventListener("mousemove", e => {
      if (!dragging) return;

      card.style.left = (e.clientX - offsetX) + "px";
      card.style.top = (e.clientY - offsetY) + "px";
    });

    window.addEventListener("mouseup", () => {
      if (!dragging) return;

      dragging = false;
      card.classList.remove("dragging");

      // Save position
      localStorage.setItem(key, JSON.stringify({
        x: card.offsetLeft,
        y: card.offsetTop
      }));
    });
  });
};
