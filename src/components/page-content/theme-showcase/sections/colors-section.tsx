"use client";

const BRAND_COLORS = [
  { label: "Primary", var: "primary", fg: "primary-foreground" },
  { label: "Secondary", var: "secondary", fg: "secondary-foreground" },
  { label: "Accent", var: "accent", fg: "accent-foreground" },
] as const;

function Swatch({
  label,
  cssVar,
  fgVar,
}: {
  label: string;
  cssVar: string;
  fgVar: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="size-14 rounded-lg border border-border/40 shadow-sm"
        style={{ backgroundColor: `var(--${cssVar})` }}
      >
        <span
          className="flex size-full items-center justify-center text-[10px] font-medium"
          style={{ color: `var(--${fgVar})` }}
        >
          Aa
        </span>
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
        <h2 className="text-lg font-semibold">Brand Colors</h2>
        <p className="text-sm text-muted-foreground">
          These colors are derived from your primary color and applied across the
          entire dashboard.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        {BRAND_COLORS.map((c) => (
          <Swatch key={c.var} label={c.label} cssVar={c.var} fgVar={c.fg} />
        ))}
      </div>
    </section>
  );
}
