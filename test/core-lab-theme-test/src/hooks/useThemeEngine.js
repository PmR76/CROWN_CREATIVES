import { useEffect } from "react";

export default function useThemeEngine() {
  useEffect(() => {
    const initial = document.body.dataset.theme || "day";
    document.body.dataset.theme = initial;
    window.dispatchEvent(new CustomEvent("theme-set", { detail: initial }));
  }, []);
}
