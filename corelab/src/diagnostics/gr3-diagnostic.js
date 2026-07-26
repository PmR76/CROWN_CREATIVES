// ============================================================
// CoreLab GR3 Diagnostic Program
// ============================================================

(function () {
  console.log("=== CORELAB GR3 DIAGNOSTIC START ===");

  // 1 — Check if LabHome is mounted
  const labHomeMounted = !!document.querySelector(".lab-shell");
  console.log("LabHome mounted:", labHomeMounted);

  // 2 — Check if ModuleStreamer is mounted
  const moduleStreamerMounted = !!window.__MODULE_STREAMER_ACTIVE;
  console.log("ModuleStreamer mounted:", moduleStreamerMounted);

  // 3 — Check if WatchkeeperHUD is dispatching events
  let eventReceived = false;
  window.addEventListener("stream-module", () => {
    eventReceived = true;
  });

  setTimeout(() => {
    window.dispatchEvent(new CustomEvent("stream-module", { detail: "test" }));
    console.log("WatchkeeperHUD dispatch working:", eventReceived);
  }, 500);

  // 4 — Check module registry
  try {
    import("../labs/moduleRegistry.js").then((mod) => {
      console.log("Module registry keys:", Object.keys(mod.modules));
    });
  } catch (err) {
    console.log("Module registry error:", err.message);
  }

  // 5 — Check for ghost ThemePanel.jsx references
  fetch("/src/components/ThemePanel.jsx")
    .then((res) => {
      console.log("ThemePanel ghost reference:", res.status !== 404);
    })
    .catch(() => {
      console.log("ThemePanel ghost reference: false");
    });

  // 6 — Check if GR3 sandbox is active
  const isGR3 = !!window.__GR3_ACTIVE;
  console.log("GR3 sandbox active:", isGR3);

  // 7 — Check robots.txt validity
  fetch("/robots.txt")
    .then((res) => res.text())
    .then((txt) => {
      const invalid = txt.includes("<!DOCTYPE html>");
      console.log("robots.txt valid:", !invalid);
    });

  // 8 — Check if labs are resolvable
  const labs = [
    "HeaderLab",
    "HeroCrownLab",
    "GalleryLab",
    "CardsLab",
    "TickerLab",
    "FooterLab",
  ];

  labs.forEach((lab) => {
    try {
      import(`../labs/${lab}.jsx`)
        .then(() => console.log(`${lab}: OK`))
        .catch(() => console.log(`${lab}: NOT FOUND`));
    } catch {
      console.log(`${lab}: NOT FOUND`);
    }
  });

  console.log("=== CORELAB GR3 DIAGNOSTIC END ===");
})();
