"use client";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { BrandControlsPanel } from "./brand-controls";
import { ColorsSection } from "./sections/colors-section";
import { TypographySection } from "./sections/typography-section";
import { ButtonsSection } from "./sections/buttons-section";
import { InputsSection } from "./sections/inputs-section";
import { CardsSection } from "./sections/cards-section";
import { TablesSection } from "./sections/tables-section";
import { NavigationSection } from "./sections/navigation-section";
import { OverlaysSection } from "./sections/overlays-section";
import { FeedbackSection } from "./sections/feedback-section";
import { IconsSection } from "./sections/icons-section";
import { MotionSection } from "./sections/motion-section";
import { CustomComponentsSection } from "./sections/custom-components-section";

export function ThemeShowcase() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Showcase sections */}
      <div className="flex-1 min-w-0 space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Configure Your Theme</h1>
          <p className="text-sm text-muted-foreground">
            Adjust values and ensure all components look good together
          </p>
        </div>

        <ColorsSection />
        <Separator />
        <CustomComponentsSection />
        <Separator />
        <IconsSection />
        <Separator />
        <TablesSection />
        <Separator />
        <MotionSection />

        <FeedbackSection />
        <Separator />
        <ButtonsSection />
        <Separator />
        <NavigationSection />
        <Separator />
        <OverlaysSection />

        {/* ── Component Library: available primitives ── */}
        <p className="text-xs font-semibold text-primary uppercase tracking-widest pt-4">
          Component Library
        </p>

        <TypographySection />
        <Separator />
        <InputsSection />
        <Separator />
        <CardsSection />
      </div>

      {/* Sticky brand controls sidebar */}
      <aside className="w-full shrink-0 lg:w-72 xl:w-80">
        <div className="lg:sticky lg:top-4">
          <ScrollArea className="max-h-[calc(100vh-6rem)]">
            <div className="rounded-xl border border-border/60 bg-card p-4">
              <BrandControlsPanel />
            </div>
          </ScrollArea>
        </div>
      </aside>
    </div>
  );
}
