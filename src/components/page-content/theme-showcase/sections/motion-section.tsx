"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/motion-primitives/animated-number";
import { TextEffect, type PresetType as TextPreset } from "@/components/motion-primitives/text-effect";
import { AnimatedGroup, type PresetType as GroupPreset } from "@/components/motion-primitives/animated-group";

const TEXT_PRESETS: TextPreset[] = ["blur", "fade-in-blur", "scale", "fade", "slide"];
const GROUP_PRESETS: GroupPreset[] = ["fade", "slide", "scale", "blur", "blur-slide", "zoom", "flip", "bounce", "rotate", "swing"];

export function MotionSection() {
  const [number, setNumber] = React.useState(1234);
  const [textKey, setTextKey] = React.useState(0);
  const [groupKey, setGroupKey] = React.useState(0);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Motion</h2>
        <p className="text-sm text-muted-foreground">
          AnimatedNumber, TextEffect presets, and AnimatedGroup presets.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          AnimatedNumber
        </p>
        <div className="flex items-center gap-4">
          <span className="text-3xl font-semibold">
            $<AnimatedNumber value={number} springOptions={{ stiffness: 100, damping: 15 }} />
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setNumber(Math.floor(Math.random() * 50000))}
          >
            Randomize
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            TextEffect Presets
          </p>
          <Button variant="ghost" size="xs" onClick={() => setTextKey((k) => k + 1)}>
            Replay
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" key={textKey}>
          {TEXT_PRESETS.map((preset) => (
            <div key={preset} className="rounded-lg border border-border/40 p-3 space-y-1">
              <p className="text-[10px] font-medium text-muted-foreground uppercase">{preset}</p>
              <TextEffect preset={preset} per="word" className="text-sm">
                The quick brown fox jumps
              </TextEffect>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            AnimatedGroup Presets
          </p>
          <Button variant="ghost" size="xs" onClick={() => setGroupKey((k) => k + 1)}>
            Replay
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" key={groupKey}>
          {GROUP_PRESETS.map((preset) => (
            <div key={preset} className="rounded-lg border border-border/40 p-3 space-y-1">
              <p className="text-[10px] font-medium text-muted-foreground uppercase">{preset}</p>
              <AnimatedGroup preset={preset} className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="size-8 rounded-md bg-primary/20 flex items-center justify-center text-xs font-medium"
                  >
                    {i}
                  </div>
                ))}
              </AnimatedGroup>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
