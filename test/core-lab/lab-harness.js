// Crown Creatives Lab Harness v2.1 (Strict Isolation + Draggable Panel)
// Drop this file into every *-lab folder.

(function () {

  /* ============================================================
     LAB IDENTIFICATION
     ============================================================ */

  const LAB_NAME = document.body.getAttribute("data-lab-name");
  const LAB_ROOT = LAB_NAME.replace("-lab", "");
  const INDEX_FILE = `./${LAB_ROOT}-index.html`;

  const STATUS_ID = "cc-lab-status";
  const TS_ID = "cc-lab-timestamp";

  /* ============================================================
     PANEL CREATION
     ============================================================ */

  function ensurePanel(id, styles) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      Object.assign(el.style, styles);
      document.body.appendChild(el);
    }
    return el;
  }

  /* ============================================================
     TIMESTAMP
     ============================================================ */

  function timestamp() {
    const el = ensurePanel(TS_ID, {
      position: "fixed",
      bottom: "10px",
      left: "10px",
      background: "rgba(0,0,0,0.7)",
      color: "#b0ffb0",
      padding: "6px 8px",
      fontFamily: "monospace",
      fontSize: "11px",
      borderRadius: "6px",
      zIndex: 9999
    });
    el.textContent = `Refreshed: ${new Date().toLocaleString()}`;
  }

  /* ============================================================
     STATUS PANEL (NOW DRAGGABLE)
     ============================================================ */

  function status() {
    const panel = ensurePanel(STATUS_ID, {
      position: "fixed",
      bottom: "10px",
      right: "10px",
      background: "rgba(10,20,40,0.9)",
      color: "#e0f4ff",
      padding: "10px 12px",
      fontFamily: "monospace",
      fontSize: "12px",
      borderRadius: "8px",
      zIndex: 99999,
      maxWidth: "260px",
      whiteSpace: "pre-wrap",
      cursor: "default"
    });

    // Add draggable header
    const header = document.createElement("div");
    header.id = "cc-lab-status-header";
    header.textContent = "LAB PANEL";
    header.style.fontWeight = "600";
    header.style.marginBottom = "8px";
    header.style.cursor = "grab";

    // Insert header at top
    panel.prepend(header);

    const css = [...document.querySelectorAll("link[rel='stylesheet']")]
      .map(l => l.getAttribute("href"));

    const js = [...document.querySelectorAll("script")]
      .map(s => s.getAttribute("src"))
      .filter(Boolean);

    const contamination =
      css.some(c => c.includes("global")) ||
      js.some(j => j.includes("global")) ||
      css.includes("index.html") ||
      js.includes("index.html");

    const body = 
      `Lab: ${LAB_NAME}\n\n` +
      `Expected HTML: ${INDEX_FILE}\n\n` +
      `CSS Loaded:\n${css.join("\n") || "None"}\n\n` +
      `JS Loaded:\n${js.join("\n") || "None"}\n\n` +
      `Isolation: ${contamination ? "⚠️ Contamination detected" : "✔ Clean"}`;

    // Add body content
    const bodyDiv = document.createElement("div");
    bodyDiv.textContent = body;
    panel.appendChild(bodyDiv);
  }

  /* ============================================================
     HEALTH BADGE
     ============================================================ */

  function healthBadge() {
    const badge = document.createElement("div");
    badge.style.position = "fixed";
    badge.style.top = "10px";
    badge.style.right = "10px";
    badge.style.padding = "6px 10px";
    badge.style.fontFamily = "monospace";
    badge.style.fontSize = "12px";
    badge.style.borderRadius = "6px";
    badge.style.zIndex = 9999;

    const contamination =
      [...document.querySelectorAll("link[rel='stylesheet']")]
        .some(c => c.href.includes("global")) ||
      [...document.querySelectorAll("script")]
        .some(s => s.src.includes("global"));

    if (contamination) {
      badge.style.background = "#5a0000";
      badge.style.color = "#ffb0b0";
      badge.textContent = "LAB HEALTH: ⚠️ Contaminated";
    } else {
      badge.style.background = "#003b0a";
      badge.style.color = "#b0ffb0";
      badge.textContent = "LAB HEALTH: ✔ Clean";
    }

    document.body.appendChild(badge);
  }

  /* ============================================================
     VERSION INFO
     ============================================================ */

  function versionInfo() {
    fetch(`./${LAB_ROOT}-version.json`)
      .then(r => r.json())
      .then(v => {
        const box = document.createElement("div");
        box.style.position = "fixed";
        box.style.top = "10px";
        box.style.left = "10px";
        box.style.background = "rgba(0,0,0,0.7)";
        box.style.color = "#e0f4ff";
        box.style.padding = "6px 10px";
        box.style.fontFamily = "monospace";
        box.style.fontSize = "12px";
        box.style.borderRadius = "6px";
        box.style.zIndex = 9999;
        box.textContent = `v${v.version} — ${v.updated}`;
        document.body.appendChild(box);
      })
      .catch(() => {});
  }

  /* ============================================================
     ERROR TRACING
     ============================================================ */

  function errors() {
    window.addEventListener("error", evt => {
      const panel = document.getElementById(STATUS_ID);
      const box = document.createElement("div");
      box.style.color = "#ffb0b0";
      box.style.marginTop = "8px";
      box.textContent = `JS Error: ${evt.message}`;
      panel.appendChild(box);
    });

    window.addEventListener("unhandledrejection", evt => {
      const panel = document.getElementById(STATUS_ID);
      const box = document.createElement("div");
      box.style.color = "#ffdf9b";
      box.style.marginTop = "8px";
      box.textContent = `Promise Rejection: ${evt.reason}`;
      panel.appendChild(box);
    });
  }

  /* ============================================================
     DRAGGABLE STATUS PANEL
     ============================================================ */

  function makeDraggable() {
    const panel = document.getElementById(STATUS_ID);
    const header = document.getElementById("cc-lab-status-header");

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    function loadPosition() {
      const saved = localStorage.getItem("cc-lab-status-pos");
      if (!saved) return;

      const pos = JSON.parse(saved);
      panel.style.left = pos.left;
      panel.style.top = pos.top;
      panel.style.bottom = "auto";
      panel.style.right = "auto";
    }

    loadPosition();

    function savePosition() {
      const pos = {
        left: panel.style.left,
        top: panel.style.top
      };
      localStorage.setItem("cc-lab-status-pos", JSON.stringify(pos));
    }

    header.addEventListener("mousedown", (e) => {
      dragging = true;

      const rect = panel.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      panel.style.transition = "none";
      e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;

      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;

      panel.style.left = `${x}px`;
      panel.style.top = `${y}px`;
      panel.style.bottom = "auto";
      panel.style.right = "auto";
    });

    window.addEventListener("mouseup", () => {
      if (!dragging) return;
      dragging = false;
      panel.style.transition = "";
      savePosition();
    });
  }

  /* ============================================================
     BOOTSTRAP (RUN ONCE)
     ============================================================ */

  document.addEventListener("DOMContentLoaded", () => {
    timestamp();
    status();
    errors();
    healthBadge();
    versionInfo();
    makeDraggable();
  });

})();
