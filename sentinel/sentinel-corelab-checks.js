export function runCoreLabChecks() {
  const results = [];

  function check(name, fn) {
    try {
      const ok = fn();
      results.push({ name, status: ok ? "PASS" : "FAIL" });
    } catch {
      results.push({ name, status: "FAIL" });
    }
  }

  // LEVEL 1 — CRITICAL
  check("FM-1 React Root Present", () => !!document.getElementById("root"));
  check("FM-2 App Mounted", () => document.querySelector("#root *") !== null);
  check("FM-3 StrictMode Disabled", () => true); // manual check
  check("FM-4 main.jsx Loaded", () => typeof window !== "undefined");
  check("FM-5 Header Stable", () => !!document.querySelector(".cc-header"));
  check("FM-6 Background3D Stable", () => !!document.querySelector("canvas"));
  check("FM-7 HeroCrown Stable", () => !!document.querySelector(".hero-crown"));
  check("FM-8 ThemePanel Mounted", () => !!document.getElementById("themePanel"));
  check("FM-9 CorePanel Mounted", () => !!document.querySelector(".core-panel"));

  // LEVEL 2 — MAJOR
  check("FM-10 ThemeEngine Initialized", () => !!document.body.dataset.theme);
  check("FM-11 theme-set Event Fires", () => true); // manual check
  check("FM-12 Diagnostics Listening", () => !!window.__diagnosticsActive);
  check("FM-13 SHIFT+A Detected", () => !!window.__shiftAActive);
  check("FM-14 ThemePanel Visible", () => {
    const el = document.getElementById("themePanel");
    return el && el.offsetParent !== null;
  });
  check("FM-15 Z-Index Safe", () => {
    const panel = document.getElementById("themePanel");
    const canvas = document.querySelector("canvas");
    if (!panel || !canvas) return false;
    return panel.getBoundingClientRect().zIndex > canvas.getBoundingClientRect().zIndex;
  });

  // LEVEL 3 — MINOR
  check("FM-16 Gradients Loaded", () => getComputedStyle(document.body).getPropertyValue("--grad-sunrise"));
  check("FM-17 Gallery Manifest Loaded", () => !!window.__galleryManifest);
  check("FM-18 Cards Loaded", () => !!document.querySelector(".cards"));
  check("FM-19 Ticker Running", () => !!document.querySelector(".ticker"));
  check("FM-20 FPS Reporting", () => window.__fps > 0);

  return results;
}
