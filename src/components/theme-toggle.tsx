import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  function toggleTheme() {
    const nextTheme = !isDark;
    document.documentElement.classList.toggle("dark", nextTheme);
    setIsDark(nextTheme);
  }

  return (
    <Button
      type="button"
      onClick={toggleTheme}
      className="bg-card border-border hover:bg-card/80 text-foreground h-11 justify-start self-start rounded-xl border font-medium"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
