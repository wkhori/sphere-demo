"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "theme";

type Theme = "light" | "dark";

const applyTheme = (theme: Theme) => {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }
};

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<Theme>("light");

  React.useEffect(() => {
    let initial: Theme = "light";

    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === "light" || stored === "dark") initial = stored;
    } catch {
      initial = "light";
    }

    setTheme(initial);
    applyTheme(initial);

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const next = (event.newValue as Theme) ?? "light";
      if (next !== "light" && next !== "dark") return;
      setTheme(next);
      applyTheme(next);
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const cycleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";

    setTheme(next);
    applyTheme(next);

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore write errors (private mode, disabled storage)
    }
  };

  const label = `Theme: ${theme}`;

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={cycleTheme}
      aria-label={label}
      title={label}
    >
      {theme === "dark" ? (
        <Moon className="size-4" />
      ) : (
        <Sun className="size-4" />
      )}
    </Button>
  );
}
