/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useEffect, useState } from "react";

const initialState: any = {
  theme: "system",
  setTheme: () => null,
};

export const ThemeProviderContext = createContext<any>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui_theme",
  ...props
}: any) {
  const [theme, setTheme] = useState<any>(
    () => (localStorage.getItem(storageKey) as any) || defaultTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: any) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext {...props} value={value}>
      {children}
    </ThemeProviderContext>
  );
}
