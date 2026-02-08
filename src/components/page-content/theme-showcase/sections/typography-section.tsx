"use client";

export function TypographySection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Typography</h2>
        <p className="text-sm text-muted-foreground">
          Font family, heading scale, body text, and utility styles.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Font Family
        </p>
        <p className="text-sm font-mono text-muted-foreground">
          var(--font-geist-sans)
        </p>
        <p className="text-base">
          The quick brown fox jumps over the lazy dog. 0123456789
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Heading Scale
        </p>
        <div className="space-y-3 rounded-lg border border-border/40 p-4">
          <h1 className="text-4xl font-bold tracking-tight">Heading 1 — 4xl bold</h1>
          <h2 className="text-3xl font-semibold tracking-tight">Heading 2 — 3xl semibold</h2>
          <h3 className="text-2xl font-semibold">Heading 3 — 2xl semibold</h3>
          <h4 className="text-xl font-semibold">Heading 4 — xl semibold</h4>
          <h5 className="text-lg font-medium">Heading 5 — lg medium</h5>
          <h6 className="text-base font-medium">Heading 6 — base medium</h6>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Body & Utility
        </p>
        <div className="space-y-2 rounded-lg border border-border/40 p-4">
          <p className="text-base">Body text — base size, regular weight</p>
          <p className="text-sm">Small text — sm size</p>
          <p className="text-xs">Extra small text — xs size</p>
          <p className="text-sm text-muted-foreground">Muted text — secondary information</p>
          <p className="text-sm font-medium">Medium weight — labels and actions</p>
          <p className="text-sm font-semibold">Semibold — emphasis</p>
          <code className="text-sm font-mono bg-muted px-1.5 py-0.5 rounded">
            Monospace / code text
          </code>
        </div>
      </div>
    </section>
  );
}
