/* PARTICLE FIELD GENERATION */
const particleField = document.getElementById("particle-field");

function spawnParticle() {
  const p = document.createElement("div");
  p.className = "particle";
  p.style.left = Math.random() * 100 + "vw";
  p.style.bottom = "-20px";
  p.style.animationDuration = 8 + Math.random() * 8 + "s";
  particleField.appendChild(p);

  setTimeout(() => p.remove(), 15000);
}

setInterval(spawnParticle, 400);

/* 3D TILT */
document.querySelectorAll(".frost-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    card.style.transform =
      `rotateX(${(-y / 20)}deg) rotateY(${(x / 20)}deg) scale(1.03)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  });
});

/* ADMIN PANEL TOGGLE (Shift+T) */
let adminVisible = false;

window.addEventListener("keydown", e => {
  if (e.key === "T" && e.shiftKey) {
    adminVisible = !adminVisible;
    document.getElementById("cards-admin").style.display =
      adminVisible ? "block" : "none";
  }
});

/* ADMIN PANEL BUTTONS */
document.querySelectorAll("#cards-admin button").forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.toggle;

    if (type === "particles") {
      particleField.style.display =
        particleField.style.display === "none" ? "block" : "none";
    }

    if (type === "borders") {
      document.body.classList.toggle("no-borders");
    }

    if (type === "crowns") {
      document.body.classList.toggle("no-crown-anim");
    }

    if (type === "tilt") {
      document.body.classList.toggle("no-tilt");
    }
  });
});
function updateLabTimestamp() {
  const ts = new Date().toLocaleString();
  const el = document.getElementById("cc-timestamp");
  if (el) el.textContent = `Updated: ${ts}`;
}

document.addEventListener("DOMContentLoaded", updateLabTimestamp);
window.addEventListener("load", updateLabTimestamp);
