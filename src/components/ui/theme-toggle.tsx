"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBrand } from "@/components/brand-provider";

export function ThemeToggle() {
  const { mode, setMode, allowDarkMode } = useBrand();

  // Hide toggle entirely when tenant disables dark mode
  if (!allowDarkMode) return null;

  const cycleTheme = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  const label = `Theme: ${mode}`;

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={cycleTheme}
      aria-label={label}
      title={label}
    >
      {mode === "dark" ? (
        <Moon className="size-4" />
      ) : (
        <Sun className="size-4" />
      )}
    </Button>
  );
}
