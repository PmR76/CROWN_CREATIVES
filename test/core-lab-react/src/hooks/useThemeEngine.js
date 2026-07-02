import { useEffect } from "react";

export default function useThemeEngine() {
  useEffect(() => {
    const savedMode = localStorage.getItem("cc-mode") || "day";

    const applyMode = (mode) => {
      document.body.dataset.theme = mode;
      localStorage.setItem("cc-mode", mode);

      document.dispatchEvent(
        new CustomEvent("theme-changed", { detail: mode })
      );
    };

    applyMode(savedMode);
  }, []);
}
