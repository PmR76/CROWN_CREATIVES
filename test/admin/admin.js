/* ============================================================
   CROWN CREATIVES — GLOBAL ADMIN SYSTEM (GR1)
   Unified admin mode, admin panel, draggable + editable helpers,
   footer wiring, ticker wiring, layout wiring.
============================================================ */

window.CC = window.CC || {};

/* ------------------------------------------------------------
   1. GLOBAL ADMIN STATE
------------------------------------------------------------ */
CC.admin = {
  active: false,
  panel: null
};

/* ------------------------------------------------------------
   2. SHIFT + A → TOGGLE ADMIN PANEL ONLY
------------------------------------------------------------ */
document.addEventListener("keydown", (e) => {
  if (e.shiftKey && e.key.toLowerCase() === "a") {
    CC.admin.active = !CC.admin.active;
    document.body.classList.toggle("admin-active", CC.admin.active);

    if (CC.admin.panel) {
      CC.admin.panel.style.display = CC.admin.active ? "block" : "none";
    }
  }
});

/* ------------------------------------------------------------
   3. CREATE ADMIN PANEL UI
------------------------------------------------------------ */
function createAdminPanel() {
  const panel = document.createElement("div");
  panel.id = "cc-admin-panel";

  panel.innerHTML = `
    <div class="cc-admin-header">Crown Admin</div>

    <div class="cc-admin-section">
      <div class="cc-admin-title">Layout</div>
      <button data-action="layout-add-page">Add Page</button>
      <button data-action="layout-remove-page">Remove Page</button>
    </div>

    <div class="cc-admin-section">
      <div class="cc-admin-title">Header</div>
      <button data-action="header-add">Add Header</button>
      <button data-action="header-remove">Remove Header</button>
    </div>

    <div class="cc-admin-section">
      <div class="cc-admin-title">Footer</div>
      <button data-action="footer-resize">Resize Footer</button>
      <button data-action="footer-icons-edit">Edit Icons</button>
      <button data-action="footer-icons-add">Add Icon</button>
      <button data-action="footer-icons-remove">Remove Icon</button>
    </div>

    <div class="cc-admin-section">
      <div class="cc-admin-title">Ticker</div>
      <button data-action="ticker-edit">Edit Ticker</button>
      <button data-action="ticker-speed">Adjust Speed</button>
    </div>
  `;

  document.body.appendChild(panel);
  CC.admin.panel = panel;

  /* ------------------------------------------------------------
     4. PANEL BUTTON ACTIONS
  ------------------------------------------------------------ */
  panel.addEventListener("click", (e) => {
    const action = e.target.dataset.action;
    if (!action) return;

    switch (action) {

      /* ------------------------------
         FOOTER ACTIONS
      ------------------------------ */
      case "footer-resize":
        CC.footer.resize();
        break;

      case "footer-icons-edit":
        CC.footer.toggleIconEdit();
        break;

      case "footer-icons-add":
        CC.footer.addIcon();
        break;

      case "footer-icons-remove":
        CC.footer.removeIcon();
        break;

      /* ------------------------------
         TICKER ACTIONS
      ------------------------------ */
      case "ticker-edit":
        document.body.classList.toggle("cc-ticker-edit");
        break;

      case "ticker-speed":
        document.body.classList.toggle("cc-ticker-speed-mode");
        break;

      /* ------------------------------
         LAYOUT + HEADER (placeholders)
      ------------------------------ */
      case "layout-add-page":
      case "layout-remove-page":
      case "header-add":
      case "header-remove":
        alert("This feature will be wired next.");
        break;
    }
  });
}

document.addEventListener("DOMContentLoaded", createAdminPanel);


/* ============================================================
   5. GLOBAL DRAGGABLE HELPER
============================================================ */
CC.drag = {
  makeDraggable(el, { key } = {}) {
    let offsetX = 0;
    let offsetY = 0;

    el.addEventListener("mousedown", (e) => {
      if (!CC.admin.active) return;

      el.style.position = "absolute";
      offsetX = e.clientX - el.offsetLeft;
      offsetY = e.clientY - el.offsetTop;

      function move(ev) {
        el.style.left = `${ev.clientX - offsetX}px`;
        el.style.top = `${ev.clientY - offsetY}px`;
      }

      function stop() {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", stop);

        if (key) {
          localStorage.setItem(key, JSON.stringify({
            x: el.offsetLeft,
            y: el.offsetTop
          }));
        }
      }

      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", stop);
    });

    if (key) {
      const saved = localStorage.getItem(key);
      if (saved) {
        const pos = JSON.parse(saved);
        el.style.position = "absolute";
        el.style.left = pos.x + "px";
        el.style.top = pos.y + "px";
      }
    }
  }
};


/* ============================================================
   6. GLOBAL EDITABLE HELPER
============================================================ */
CC.edit = {
  makeEditable(el, { key } = {}) {
    if (key) {
      const saved = localStorage.getItem(key);
      if (saved) el.innerText = saved;
    }

    document.addEventListener("click", (e) => {
      if (!CC.admin.active) return;
      if (!el.contains(e.target)) return;

      el.contentEditable = "true";
      el.classList.add("cc-editing");
    });

    document.addEventListener("keydown", (e) => {
      if (!CC.admin.active) return;
      if (e.key === "Enter" && e.ctrlKey) {
        el.contentEditable = "false";
        el.classList.remove("cc-editing");
        if (key) {
          localStorage.setItem(key, el.innerText);
        }
      }
    });
  }
};
