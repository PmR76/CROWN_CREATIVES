import { useEffect, useState, useCallback } from "react";

export default function useThemeEngine() {
  const [themeRole, setThemeRole] = useState(
    localStorage.getItem("cc-theme-role") || "day"
  );

  const applyTheme = useCallback((nextRole) => {
    setThemeRole(nextRole);
    document.body.dataset.themeRole = nextRole;
    localStorage.setItem("cc-theme-role", nextRole);

    window.dispatchEvent(
      new CustomEvent("theme-changed", { detail: nextRole })
    );
  }, []);

  useEffect(() => {
    applyTheme(themeRole);
  }, [themeRole, applyTheme]);

  return { themeRole };
}
