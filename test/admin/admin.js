// admin/admin.js

window.CC = window.CC || {};

// GLOBAL ADMIN STATE
CC.admin = {
  active: false,
  panel: null,
  toggle() {
    this.active = !this.active;
    document.body.classList.toggle("admin-active", this.active);
    if (this.panel) {
      this.panel.style.display = this.active ? "block" : "none";
    }
  }
};

// SHIFT + A → TOGGLE ADMIN
document.addEventListener("keydown", (e) => {
  if (e.shiftKey && e.key.toLowerCase() === "a") {
    CC.admin.toggle();
  }
});

// CREATE ADMIN PANEL
function createAdminPanel() {
  const panel = document.createElement("div");
  panel.id = "cc-admin-panel";
  panel.innerHTML = `
    <div class="cc-admin-header">Crown Admin</div>
    <div class="cc-admin-section">
      <div class="cc-admin-title">Layout</div>
      <button data-action="add-header">Add Header</button>
      <button data-action="add-main">Add Main Page</button>
      <button data-action="add-footer">Add Footer</button>
      <button data-action="remove-footer">Remove Footer</button>
    </div>
    <div class="cc-admin-section">
      <div class="cc-admin-title">Footer</div>
      <button data-action="footer-resize">Resize Footer</button>
      <button data-action="footer-icons-edit">Edit Icons</button>
      <button data-action="footer-backtotop">Back to Top</button>
    </div>
    <div class="cc-admin-section">
      <div class="cc-admin-title">Ticker</div>
      <button data-action="ticker-edit">Edit Ticker</button>
      <button data-action="ticker-speed">Adjust Speed</button>
    </div>
  `;
  document.body.appendChild(panel);
  CC.admin.panel = panel;

  panel.addEventListener("click", (e) => {
    const action = e.target.dataset.action;
    if (!action) return;

    switch (action) {
      case "add-footer":
        // later: inject default footer if missing
        break;
      case "footer-resize":
        document.getElementById("cc-footer")?.classList.toggle("cc-footer-resize");
        break;
      case "footer-icons-edit":
        document.body.classList.toggle("cc-footer-icons-edit");
        break;
      case "footer-backtotop":
        // could toggle visibility or style
        break;
      case "ticker-edit":
        document.body.classList.toggle("cc-ticker-edit");
        break;
      case "ticker-speed":
        document.body.classList.toggle("cc-ticker-speed-mode");
        break;
    }
  });
}

document.addEventListener("DOMContentLoaded", createAdminPanel);
// admin/draggable.js

window.CC = window.CC || {};
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
// admin/editable.js

window.CC = window.CC || {};
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
