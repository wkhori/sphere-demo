import { BrandConfig, DEFAULT_RADIUS } from "./brand-config";

// OKLch helpers

interface Oklch {
  l: number;
  c: number;
  h: number;
}

function parseOklch(value: string): Oklch | null {
  const m = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!m) return null;
  return { l: +m[1], c: +m[2], h: +m[3] };
}

function fmt({ l, c, h }: Oklch): string {
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(3)})`;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

// Light mode derivations

function deriveSecondary(p: Oklch): Oklch {
  return { l: clamp(p.l + 0.42, 0, 0.98), c: p.c * 0.08, h: p.h };
}

function deriveAccent(p: Oklch): Oklch {
  return { l: clamp(p.l + 0.42, 0, 0.98), c: p.c * 0.1, h: (p.h + 15) % 360 };
}

// Dark mode derivations

function deriveDarkPrimary(p: Oklch): Oklch {
  return { l: clamp(1 - p.l + 0.15, 0.6, 0.95), c: p.c * 0.85, h: p.h };
}

function deriveDarkSecondary(p: Oklch): Oklch {
  return { l: clamp(p.l - 0.05, 0.15, 0.35), c: p.c * 0.06, h: p.h };
}

function deriveDarkAccent(p: Oklch): Oklch {
  return { l: clamp(p.l - 0.05, 0.15, 0.35), c: p.c * 0.08, h: (p.h + 15) % 360 };
}

// Foreground helper — pick dark or light text based on bg lightness
function fg(lightness: number, dark: string, light: string) {
  return lightness > 0.6 ? dark : light;
}

/**
 * Build CSS variable overrides from a BrandConfig.
 * Only returns overrides — unset tokens keep their globals.css defaults.
 */
export function cssVarsFromConfig(
  config: BrandConfig,
  mode: "light" | "dark",
): Record<string, string> {
  const vars: Record<string, string> = {};
  const p = parseOklch(config.primary);
  if (!p) return vars;

  if (mode === "light") {
    vars["--primary"] = config.primary;
    vars["--primary-foreground"] = fg(p.l, "oklch(0.145 0 0)", "oklch(0.985 0 0)");

    const sec = config.secondary ? parseOklch(config.secondary) : deriveSecondary(p);
    if (sec) {
      vars["--secondary"] = fmt(sec);
      vars["--secondary-foreground"] = fg(sec.l, "oklch(0.205 0 0)", "oklch(0.985 0 0)");
    }

    const acc = config.accent ? parseOklch(config.accent) : deriveAccent(p);
    if (acc) {
      vars["--accent"] = fmt(acc);
      vars["--accent-foreground"] = fg(acc.l, "oklch(0.205 0 0)", "oklch(0.985 0 0)");
    }

    vars["--ring"] = fmt({ l: 0.708, c: p.c * 0.3, h: p.h });

    // Sidebar mirrors primary/accent
    vars["--sidebar-primary"] = config.primary;
    vars["--sidebar-primary-foreground"] = vars["--primary-foreground"];
    if (acc) {
      vars["--sidebar-accent"] = fmt(acc);
      vars["--sidebar-accent-foreground"] = vars["--accent-foreground"];
    }
    vars["--sidebar-ring"] = vars["--ring"];
  } else {
    const dp = deriveDarkPrimary(p);
    vars["--primary"] = fmt(dp);
    vars["--primary-foreground"] = fg(dp.l, "oklch(0.205 0 0)", "oklch(0.985 0 0)");

    const sec = config.secondary ? parseOklch(config.secondary) : deriveDarkSecondary(p);
    if (sec) {
      vars["--secondary"] = fmt(sec);
      vars["--secondary-foreground"] = "oklch(0.985 0 0)";
    }

    const acc = config.accent ? parseOklch(config.accent) : deriveDarkAccent(p);
    if (acc) {
      vars["--accent"] = fmt(acc);
      vars["--accent-foreground"] = "oklch(0.985 0 0)";
    }

    vars["--ring"] = fmt({ l: 0.556, c: p.c * 0.3, h: p.h });

    vars["--sidebar-primary"] = fmt({ l: 0.488, c: p.c * 0.8, h: p.h });
    vars["--sidebar-primary-foreground"] = "oklch(0.985 0 0)";
    if (acc) {
      vars["--sidebar-accent"] = fmt(acc);
      vars["--sidebar-accent-foreground"] = "oklch(0.985 0 0)";
    }
    vars["--sidebar-ring"] = vars["--ring"];
  }

  if (config.radius != null) {
    vars["--radius"] = `${config.radius / 16}rem`;
  }

  if (config.fontFamily) {
    vars["--font-geist-sans"] = config.fontFamily;
  }

  return vars;
}

/** Set CSS vars on <html>. */
export function applyBrandToDocument(vars: Record<string, string>): void {
  if (typeof document === "undefined") return;
  const s = document.documentElement.style;
  for (const [k, v] of Object.entries(vars)) s.setProperty(k, v);
}

/** Remove previously-applied brand overrides, restoring stylesheet defaults. */
export function clearBrandFromDocument(vars: Record<string, string>): void {
  if (typeof document === "undefined") return;
  const s = document.documentElement.style;
  for (const k of Object.keys(vars)) s.removeProperty(k);
}

/** Apply brand config for the given mode. Returns the var map for later cleanup. */
export function applyBrandConfig(
  config: BrandConfig | null,
  mode: "light" | "dark",
): Record<string, string> {
  if (!config) return {};
  const vars = cssVarsFromConfig(config, mode);
  applyBrandToDocument(vars);
  return vars;
}

export function getDefaultRadius(): number {
  return DEFAULT_RADIUS;
}
