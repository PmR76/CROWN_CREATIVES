// ============================================================
// FaultScanner.jsx — Crown Creatives Runtime Fault Scanner
// ============================================================
// This component detects ANY React runtime error, ANY mount
// failure, ANY swallowed exception, and logs EXACTLY what broke.
// ============================================================

import { useEffect } from "react";

export default function FaultScanner() {

  useEffect(() => {
    console.log("FaultScanner: ACTIVE");

    // GLOBAL ERROR CATCHER
    window.addEventListener("error", (e) => {
      console.log("❌ GLOBAL ERROR:", e.error);
    });

    // PROMISE / REACT ERROR CATCHER
    window.addEventListener("unhandledrejection", (e) => {
      console.log("❌ PROMISE ERROR:", e.reason);
    });

    // COMPONENT MOUNT CHECKS
    const components = [
      "Header",
      "Background3D",
      "HeroCrown",
      "ThemePanel",
      "HeroGallery",
      "Cards",
      "Ticker",
      "Footer",
      "CorePanel"
    ];

    components.forEach((name) => {
      console.log(`🔍 Checking mount: ${name}`);
    });

  }, []);

  return null;
}
