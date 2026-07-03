import { useEffect } from "react";
import useThemeEngine from "../hooks/useThemeEngine";

export default function ThemePanel() {
  const { theme, setTheme } = useThemeEngine();

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.dispatchEvent(new CustomEvent("theme-set", { detail: next }));
  };

  useEffect(() => {
    console.log("ThemePanel active, theme:", theme);
  }, [theme]);

  return (
    <div className="theme-panel">
      <button type="button" onClick={toggleTheme}>
        Toggle Theme ({theme})
      </button>
    </div>
  );
}
