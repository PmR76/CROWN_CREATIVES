import { useEffect, useRef } from "react";

export default function Background3D() {
  const ref = useRef(null);

  useEffect(() => {
    const updateBackground = () => {
      const gradient = getComputedStyle(document.documentElement)
        .getPropertyValue("--cc-page-background")
        .trim();

      if (ref.current) {
        ref.current.style.backgroundImage = gradient || "none";
      }
    };

    updateBackground();
    window.addEventListener("themeChanged", updateBackground);

    return () => window.removeEventListener("themeChanged", updateBackground);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1,
        pointerEvents: "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}
