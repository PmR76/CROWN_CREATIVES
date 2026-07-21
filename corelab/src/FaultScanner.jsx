// ============================================================
// FaultScanner.jsx — Crown Creatives Runtime Fault Scanner
// ============================================================

import { useEffect } from "react";

export default function FaultScanner() {
  useEffect(() => {
    console.log("FaultScanner: ACTIVE");

    const onError = (e) => {
      console.log("❌ GLOBAL ERROR:", e.error);
    };

    const onUnhandled = (e) => {
      console.log("❌ PROMISE ERROR:", e.reason);
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandled);

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

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandled);
    };
  }, []);

  return null;
}
