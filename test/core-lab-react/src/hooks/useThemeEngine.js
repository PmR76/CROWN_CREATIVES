import { useEffect, useState } from "react";

export default function useThemeEngine() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.dataset.theme = theme;
    window.dispatchEvent(new CustomEvent("theme-changed", { detail: theme }));
  }, [theme]);

  useEffect(() => {
    const handler = e => {
      const next = e.detail;
      setTheme(next);
    };

    window.addEventListener("theme-set", handler);
    return () => window.removeEventListener("theme-set", handler);
  }, []);

  return { theme, setTheme };
}
