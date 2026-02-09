// Multi-tenant brand configuration.
// Only `primary` is required — everything else auto-derives or falls back.

export interface BrandConfig {
  /** OKLch string, e.g. "oklch(0.55 0.2 260)" */
  primary: string;
  /** Auto-derived from primary when omitted */
  secondary?: string;
  /** Auto-derived from primary when omitted */
  accent?: string;

  logoUrl?: string;
  logoAlt?: string;

  /** Base border-radius in px (default: 10) */
  radius?: number;
  /** Pick from available system/web fonts */
  fontFamily?: string;

  allowDarkMode?: boolean;
  defaultMode?: "light" | "dark";
  tenantName?: string;
}

/** System + web-safe fonts available in the controls panel */
export const AVAILABLE_FONTS = [
  { label: "Geist (Default)", value: "" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "System UI", value: "system-ui, sans-serif" },
  {
    label: "Helvetica Neue",
    value: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  { label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
  { label: "Menlo", value: "Menlo, Consolas, monospace" },
] as const;

export const BRAND_STORAGE_KEY = "brand-config";
export const THEME_STORAGE_KEY = "theme";
export const DEFAULT_RADIUS = 10;
