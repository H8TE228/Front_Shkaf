import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks";
import { Button } from "../ui/button";

const themes = [
  { value: "system", icon: Laptop },
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const currentIndex = themes.findIndex((item) => item.value === theme);
  const currentTheme = themes[currentIndex] ?? themes[0];
  const Icon = currentTheme.icon;

  const toggleTheme = () => {
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex].value);
  };

  return (
    <Button
      type="button"
      variant="defaultWhite"
      onClick={toggleTheme}
      className="bg-card border-border text-foreground hover:bg-card/80 h-11 w-11 rounded-xl border"
    >
      <Icon className="size-4" />
    </Button>
  );
}
