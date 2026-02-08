"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle, Info, Minus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const BADGES = [
  { label: "Success", bg: "bg-status-success", fg: "text-status-success-foreground", icon: CheckCircle2 },
  { label: "Warning", bg: "bg-status-warning", fg: "text-status-warning-foreground", icon: AlertTriangle },
  { label: "Error", bg: "bg-status-error", fg: "text-status-error-foreground", icon: XCircle },
  { label: "Info", bg: "bg-status-info", fg: "text-status-info-foreground", icon: Info },
  { label: "Neutral", bg: "bg-status-neutral", fg: "text-status-neutral-foreground", icon: Minus },
] as const;

export function FeedbackSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Feedback</h2>
        <p className="text-sm text-muted-foreground">
          Status badges, skeleton loading states, and trend indicators.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Status Badges
        </p>
        <div className="flex flex-wrap gap-3">
          {BADGES.map(({ label, bg, fg, icon: Icon }) => (
            <span
              key={label}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                bg,
                fg,
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Trend Indicators
        </p>
        <div className="flex gap-6">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-trend-positive">
            +12.5% this month
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-trend-negative">
            −4.2% this month
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Skeleton Loaders
        </p>
        <div className="space-y-3 rounded-lg border border-border/40 p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-20 w-full rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>
      </div>
    </section>
  );
}
