"use client";

const PALETTE = [
  { label: "Primary", var: "primary", fg: "primary-foreground" },
  { label: "Secondary", var: "secondary", fg: "secondary-foreground" },
  { label: "Accent", var: "accent", fg: "accent-foreground" },
  { label: "Muted", var: "muted", fg: "muted-foreground" },
  { label: "Destructive", var: "destructive", fg: null },
  { label: "Background", var: "background", fg: "foreground" },
  { label: "Card", var: "card", fg: "card-foreground" },
  { label: "Popover", var: "popover", fg: "popover-foreground" },
] as const;

const SEMANTIC = [
  { label: "Success", var: "status-success", fg: "status-success-foreground" },
  { label: "Warning", var: "status-warning", fg: "status-warning-foreground" },
  { label: "Error", var: "status-error", fg: "status-error-foreground" },
  { label: "Info", var: "status-info", fg: "status-info-foreground" },
  { label: "Neutral", var: "status-neutral", fg: "status-neutral-foreground" },
] as const;

const EXTRA = [
  { label: "Trend +", var: "trend-positive" },
  { label: "Trend −", var: "trend-negative" },
  { label: "Star", var: "star" },
  { label: "Border", var: "border" },
  { label: "Input", var: "input" },
  { label: "Ring", var: "ring" },
] as const;

const SIDEBAR_TOKENS = [
  { label: "Sidebar", var: "sidebar", fg: "sidebar-foreground" },
  { label: "Sidebar Primary", var: "sidebar-primary", fg: "sidebar-primary-foreground" },
  { label: "Sidebar Accent", var: "sidebar-accent", fg: "sidebar-accent-foreground" },
] as const;

function Swatch({
  label,
  cssVar,
  fgVar,
}: {
  label: string;
  cssVar: string;
  fgVar?: string | null;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="size-14 rounded-lg border border-border/40 shadow-sm"
        style={{ backgroundColor: `var(--${cssVar})` }}
      >
        {fgVar && (
          <span
            className="flex size-full items-center justify-center text-[10px] font-medium"
            style={{ color: `var(--${fgVar})` }}
          >
            Aa
          </span>
        )}
      </div>
      <span className="text-[10px] text-muted-foreground text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

export function ColorsSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Colors</h2>
        <p className="text-sm text-muted-foreground">
          Design token palette — all colors are driven by CSS custom properties.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Core Palette</h3>
        <div className="flex flex-wrap gap-4">
          {PALETTE.map((c) => (
            <Swatch key={c.var} label={c.label} cssVar={c.var} fgVar={c.fg} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Semantic Status</h3>
        <div className="flex flex-wrap gap-4">
          {SEMANTIC.map((c) => (
            <Swatch key={c.var} label={c.label} cssVar={c.var} fgVar={c.fg} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Utility & Sidebar</h3>
        <div className="flex flex-wrap gap-4">
          {EXTRA.map((c) => (
            <Swatch key={c.var} label={c.label} cssVar={c.var} />
          ))}
          {SIDEBAR_TOKENS.map((c) => (
            <Swatch key={c.var} label={c.label} cssVar={c.var} fgVar={c.fg} />
          ))}
        </div>
      </div>
    </section>
  );
}
