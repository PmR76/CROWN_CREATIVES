import { useEffect, useState } from "react";

export default function useThemeEngine() {
  const [theme, setTheme] = useState(
    localStorage.getItem("cc-theme") || "day"
  );

  useEffect(() => {
    function handleThemeSet(e) {
      const next = e.detail;
      setTheme(next);
      document.body.dataset.theme = next;
      localStorage.setItem("cc-theme", next);
    }

    window.addEventListener("theme-set", handleThemeSet);

    // Apply initial theme
    document.body.dataset.theme = theme;

    return () => {
      window.removeEventListener("theme-set", handleThemeSet);
    };
  }, [theme]);

  return { theme };
}
