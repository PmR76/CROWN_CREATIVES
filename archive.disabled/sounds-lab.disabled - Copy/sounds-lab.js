// Crown Creatives Lab Harness
// Reusable diagnostics + timestamp for any *-lab folder

(function () {
  /* ========= CONFIG ========= */
  const LAB_CONFIG = {
    // Optional: override per lab via data attribute on <body data-lab-name="cards-lab">
    fallbackLabName: window.location.pathname.split("/").filter(Boolean).slice(-2).join("/") || "unknown-lab",
    timestampElementId: "cc-lab-timestamp",
    statusPanelId: "cc-lab-status",
    expectedCssSelectors: [
      // Example: ensure main lab CSS is present
      'link[href*="cards.css"]',
      'link[href*="hero-crown.css"]'
    ],
    expectedJsSelectors: [
      // Example: ensure main lab JS is present
      'script[src*="cards.js"]',
      'script[src*="debug-crown.js"]',
      'script[src*="detect-external-css.js"]'
    ]
  };

  /* ========= UTILITIES ========= */

  function getLabName() {
    const body = document.body;
    const attr = body && body.getAttribute("data-lab-name");
    return attr || LAB_CONFIG.fallbackLabName;
  }

  function ensureStatusPanel() {
    let panel = document.getElementById(LAB_CONFIG.statusPanelId);
    if (!panel) {
      panel = document.createElement("div");
      panel.id = LAB_CONFIG.statusPanelId;
      panel.style.position = "fixed";
      panel.style.bottom = "10px";
      panel.style.right = "10px";
      panel.style.zIndex = "9999";
      panel.style.background = "rgba(10, 20, 40, 0.9)";
      panel.style.color = "#e0f4ff";
      panel.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      panel.style.fontSize = "12px";
      panel.style.padding = "10px 12px";
      panel.style.borderRadius = "8px";
      panel.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";
      panel.style.maxWidth = "260px";
      panel.style.pointerEvents = "none"; // read-only
      document.body.appendChild(panel);
    }
    return panel;
  }

  function ensureTimestampElement() {
    let el = document.getElementById(LAB_CONFIG.timestampElementId);
    if (!el) {
      el = document.createElement("div");
      el.id = LAB_CONFIG.timestampElementId;
      el.style.position = "fixed";
      el.style.bottom = "10px";
      el.style.left = "10px";
      el.style.zIndex = "9999";
      el.style.background = "rgba(0,0,0,0.7)";
      el.style.color = "#b0ffb0";
      el.style.fontFamily = "monospace";
      el.style.fontSize = "11px";
      el.style.padding = "6px 8px";
      el.style.borderRadius = "6px";
      el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.5)";
      document.body.appendChild(el);
    }
    return el;
  }

  function updateTimestamp() {
    const el = ensureTimestampElement();
    const ts = new Date().toLocaleString();
    el.textContent = `Lab refreshed: ${ts}`;
  }

  function checkResources() {
    const cssLoaded = LAB_CONFIG.expectedCssSelectors.map(sel => ({
      selector: sel,
      found: !!document.querySelector(sel)
    }));

    const jsLoaded = LAB_CONFIG.expectedJsSelectors.map(sel => ({
      selector: sel,
      found: !!document.querySelector(sel)
    }));

    return { cssLoaded, jsLoaded };
  }

  function renderStatusPanel() {
    const panel = ensureStatusPanel();
    const labName = getLabName();
    const { cssLoaded, jsLoaded } = checkResources();

    const cssSummary = cssLoaded.map(c =>
      `${c.found ? "✅" : "⚠️"} CSS: ${c.selector}`
    ).join("\n");

    const jsSummary = jsLoaded.map(j =>
      `${j.found ? "✅" : "⚠️"} JS: ${j.selector}`
    ).join("\n");

    panel.textContent = ""; // reset
    const pre = document.createElement("pre");
    pre.style.margin = "0";
    pre.style.whiteSpace = "pre-wrap";

    pre.textContent =
      `Crown Creatives Lab\n` +
      `Lab: ${labName}\n\n` +
      `HTML: ✅ DOM loaded\n\n` +
      `CSS:\n${cssSummary || "– no CSS checks configured –"}\n\n` +
      `JS:\n${jsSummary || "– no JS checks configured –"}\n`;

    panel.appendChild(pre);
  }

  /* ========= ERROR TRACE ========= */

  function attachErrorTracing() {
    window.addEventListener("error", evt => {
      const panel = ensureStatusPanel();
      const errBox = document.createElement("div");
      errBox.style.marginTop = "8px";
      errBox.style.paddingTop = "6px";
      errBox.style.borderTop = "1px solid rgba(255,255,255,0.15)";
      errBox.style.color = "#ffb0b0";
      errBox.style.fontFamily = "monospace";
      errBox.style.fontSize = "11px";
      errBox.textContent =
        `JS Error: ${evt.message} @ ${evt.filename}:${evt.lineno}`;
      panel.appendChild(errBox);
    });

    window.addEventListener("unhandledrejection", evt => {
      const panel = ensureStatusPanel();
      const errBox = document.createElement("div");
      errBox.style.marginTop = "8px";
      errBox.style.paddingTop = "6px";
      errBox.style.borderTop = "1px solid rgba(255,255,255,0.15)";
      errBox.style.color = "#ffdf9b";
      errBox.style.fontFamily = "monospace";
      errBox.style.fontSize = "11px";
      errBox.textContent =
        `Promise Rejection: ${evt.reason}`;
      panel.appendChild(errBox);
    });
  }

  /* ========= BOOTSTRAP ========= */

  function initLabHarness() {
    updateTimestamp();
    renderStatusPanel();
    attachErrorTracing();
  }

  document.addEventListener("DOMContentLoaded", initLabHarness);
  window.addEventListener("load", updateTimestamp); // refresh timestamp after full load
})();
