/**
 * Hex ↔ OKLch color conversion using culori.
 * Tree-shakeable: only imports the oklch + rgb converters.
 */
import { formatHex, formatCss, parse, converter } from "culori";

const toOklch = converter("oklch");

/**
 * Convert a hex color (#rrggbb or #rgb) to an OKLch CSS string.
 * Returns `oklch(L C H)` format matching our brand-config convention.
 */
export function hexToOklch(hex: string): string | null {
  const color = parse(hex);
  if (!color) return null;
  const oklch = toOklch(color);
  if (!oklch) return null;
  const l = oklch.l ?? 0;
  const c = oklch.c ?? 0;
  const h = oklch.h ?? 0;
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(3)})`;
}

/**
 * Convert an OKLch CSS string to a hex color.
 * Accepts `oklch(L C H)` format.
 */
export function oklchToHex(oklchStr: string): string | null {
  const color = parse(oklchStr);
  if (!color) return null;
  return formatHex(color);
}

/**
 * Format an OKLch color as a CSS string using culori's built-in formatter.
 */
export function formatOklchCss(oklchStr: string): string | null {
  const color = parse(oklchStr);
  if (!color) return null;
  return formatCss(toOklch(color));
}
