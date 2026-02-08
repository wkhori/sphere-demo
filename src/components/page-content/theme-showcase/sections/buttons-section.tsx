"use client";

import { ArrowRight, Download, Loader2, Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const VARIANTS = ["default", "destructive", "outline", "secondary", "ghost", "link"] as const;

export function ButtonsSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Buttons</h2>
        <p className="text-sm text-muted-foreground">
          All 6 variants across key sizes, plus disabled and icon-only states.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Variants (default size)
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {VARIANTS.map((v) => (
            <Button key={v} variant={v}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Sizes (default variant)
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          With Icons
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button>
            <Mail /> Send Email
          </Button>
          <Button variant="outline">
            <Download /> Download
          </Button>
          <Button variant="secondary">
            <Plus /> Create
          </Button>
          <Button variant="ghost">
            Next <ArrowRight />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Icon Buttons
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="icon-xs"><Plus /></Button>
          <Button size="icon-sm"><Plus /></Button>
          <Button size="icon"><Plus /></Button>
          <Button size="icon-lg"><Plus /></Button>
          <Button size="icon" variant="outline"><Mail /></Button>
          <Button size="icon" variant="ghost"><ArrowRight /></Button>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          States
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>Disabled Outline</Button>
          <Button disabled>
            <Loader2 className="animate-spin" /> Loading...
          </Button>
        </div>
      </div>
    </section>
  );
}
