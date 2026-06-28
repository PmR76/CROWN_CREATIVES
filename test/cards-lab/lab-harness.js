// Crown Creatives Lab Harness v2 (Strict Isolation)
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
     STATUS PANEL
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
      zIndex: 9999,
      maxWidth: "260px",
      whiteSpace: "pre-wrap"
    });

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

    panel.textContent =
      `Lab: ${LAB_NAME}\n\n` +
      `Expected HTML: ${INDEX_FILE}\n\n` +
      `CSS Loaded:\n${css.join("\n") || "None"}\n\n` +
      `JS Loaded:\n${js.join("\n") || "None"}\n\n` +
      `Isolation: ${contamination ? "⚠️ Contamination detected" : "✔ Clean"}`;
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
     BOOTSTRAP (RUN ONCE)
     ============================================================ */

  document.addEventListener("DOMContentLoaded", () => {
    timestamp();
    status();
    errors();
    healthBadge();
  });

})();
