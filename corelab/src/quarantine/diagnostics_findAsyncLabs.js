// ============================================================
// Find Async Labs — GR3 Debug Tool
// ============================================================

import * as HeaderLab from "../labs/HeaderLab.jsx";
import * as HeroCrownLab from "../labs/HeroCrownLab.jsx";
import * as GalleryLab from "../labs/GalleryLab.jsx";
import * as CardsLab from "../labs/CardsLab.jsx";
import * as TickerLab from "../labs/TickerLab.jsx";
import * as FooterLab from "../labs/FooterLab.jsx";
import * as TestPageLab from "../labs/TestPageLab.jsx";

const labs = {
  HeaderLab,
  HeroCrownLab,
  GalleryLab,
  CardsLab,
  TickerLab,
  FooterLab,
  TestPageLab,
};

console.log("=== Checking labs for async components ===");

Object.entries(labs).forEach(([name, mod]) => {
  const keys = Object.keys(mod);
  keys.forEach((k) => {
    const fn = mod[k];
    if (typeof fn === "function" && fn.constructor.name === "AsyncFunction") {
      console.log(`❌ ${name} → ${k} is async`);
    }
  });
});

console.log("=== Done ===");
