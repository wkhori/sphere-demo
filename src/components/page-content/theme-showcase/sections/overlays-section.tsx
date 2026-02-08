"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function OverlaysSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Overlays</h2>
        <p className="text-sm text-muted-foreground">
          Sheet panels and tooltip popovers.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Sheet (Side Panel)
        </p>
        <div className="flex gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open Right Sheet</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Sheet Title</SheetTitle>
                <SheetDescription>
                  This is a side panel that slides in from the right. It uses the Sheet component backed by Radix Dialog.
                </SheetDescription>
              </SheetHeader>
              <div className="p-4 text-sm text-muted-foreground">
                Sheet body content goes here.
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open Bottom Sheet</Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Bottom Sheet</SheetTitle>
                <SheetDescription>
                  Slides in from the bottom. Useful for mobile-style actions.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Tooltips
        </p>
        <div className="flex flex-wrap gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">Hover me (top)</Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              Tooltip on top
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">Hover me (right)</Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Tooltip on right
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">Hover me (bottom)</Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Tooltip on bottom
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </section>
  );
}
