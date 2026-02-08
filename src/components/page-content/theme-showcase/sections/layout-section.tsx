"use client";

import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function LayoutSection() {
  const [open1, setOpen1] = React.useState(true);
  const [open2, setOpen2] = React.useState(false);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Layout</h2>
        <p className="text-sm text-muted-foreground">
          Separator, scroll area, and collapsible sections.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Separator
        </p>
        <div className="rounded-lg border border-border/40 p-4 space-y-3">
          <p className="text-sm">Content above the separator</p>
          <Separator />
          <p className="text-sm">Content below the separator</p>
          <div className="flex items-center gap-3 h-5">
            <span className="text-sm">Left</span>
            <Separator orientation="vertical" />
            <span className="text-sm">Center</span>
            <Separator orientation="vertical" />
            <span className="text-sm">Right</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Scroll Area
        </p>
        <ScrollArea className="h-40 w-full rounded-lg border border-border/40 p-4">
          <div className="space-y-3">
            {Array.from({ length: 15 }, (_, i) => (
              <div key={i} className="rounded-md bg-muted/50 px-3 py-2 text-sm">
                Scrollable item {i + 1}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Collapsible
        </p>
        <div className="space-y-2">
          <Collapsible open={open1} onOpenChange={setOpen1}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                Section One (expanded)
                <ChevronDown className={`size-4 transition-transform ${open1 ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="rounded-md bg-muted/50 p-3 text-sm">
                This section is expanded by default. Click the trigger to collapse it.
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={open2} onOpenChange={setOpen2}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                Section Two (collapsed)
                <ChevronDown className={`size-4 transition-transform ${open2 ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="rounded-md bg-muted/50 p-3 text-sm">
                This section was collapsed. You expanded it!
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </section>
  );
}
