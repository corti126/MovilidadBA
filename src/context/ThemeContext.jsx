import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { getTheme, saveTheme } from "../utils/storage";

const ThemeContext = createContext(null);

function resolve(preference) {
  if (preference !== "system") return preference;
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState("system");
  const [resolved, setResolved] = useState("light");

  useEffect(() => {
    const stored = getTheme();
    setPreference(stored);
    setResolved(resolve(stored));
  }, []);

  useEffect(() => {
    setResolved(resolve(preference));
    if (preference !== "system" || typeof window === "undefined" || !window.matchMedia) return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => setResolved(resolve("system"));
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, [preference]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", resolved);
  }, [resolved]);

  const setTheme = useCallback((value) => {
    setPreference(value);
    saveTheme(value);
  }, []);

  const toggleTheme = useCallback(() => {
    setPreference((current) => {
      const next = resolve(current) === "dark" ? "light" : "dark";
      saveTheme(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ preference, theme: resolved, setTheme, toggleTheme }),
    [preference, resolved, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return context;
}
