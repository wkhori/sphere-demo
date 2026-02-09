"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Palette, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const BANNER_DISMISSED_KEY = "theme-banner-dismissed";

export function useThemeBanner() {
  const [bannerDismissed, setBannerDismissed] = React.useState(true);

  React.useEffect(() => {
    setBannerDismissed(localStorage.getItem(BANNER_DISMISSED_KEY) === "true");
  }, []);

  const dismissBanner = () => {
    setBannerDismissed(true);
    localStorage.setItem(BANNER_DISMISSED_KEY, "true");
  };

  return { bannerDismissed, dismissBanner };
}

export function ThemeBanner({
  dismissed,
  onDismiss,
  onExplore,
}: {
  dismissed: boolean;
  onDismiss: () => void;
  onExplore: () => void;
}) {
  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, height: 0, marginBottom: 0, scale: 0.98 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="group relative overflow-hidden rounded-xl border border-primary/20 bg-linear-to-r from-primary/6 via-primary/3 to-transparent p-px">
            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="absolute inset-0 rounded-xl bg-linear-to-r from-primary/20 via-primary/10 to-primary/20 blur-sm" />
            </div>

            <div className="relative flex items-center gap-4 rounded-[11px] bg-linear-to-r from-primary/6 via-background to-background px-4 py-3.5 max-sm:flex-wrap sm:px-5">
              {/* Icon */}
              <div className="relative shrink-0">
                <motion.div
                  className="absolute -inset-1 rounded-full bg-primary/10 blur-md"
                  animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="relative flex size-9 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/25 sm:size-10"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Palette
                    className="size-4 text-primary sm:size-4.5"
                    strokeWidth={1.8}
                  />
                </motion.div>
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="relative inline-flex overflow-hidden rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm shadow-primary/25">
                    New
                    <span className="absolute inset-0 -translate-x-full animate-[shimmer_3s_ease-in-out_infinite] bg-linear-to-r from-transparent via-white/30 to-transparent" />
                  </span>
                  <p className="text-sm font-semibold tracking-tight">
                    Brand theming is live
                  </p>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground max-sm:hidden">
                  Colors, typography, and logo — match your dashboard in
                  seconds.
                </p>
              </div>

              {/* CTA — full-width on mobile, auto on desktop */}
              <Button
                size="sm"
                className="group/btn relative gap-1.5 overflow-hidden shadow-sm shadow-primary/20 transition-shadow hover:shadow-md hover:shadow-primary/25 max-sm:order-last max-sm:w-full"
                onClick={() => {
                  onDismiss();
                  onExplore();
                }}
              >
                <span>Customize</span>
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight className="size-3.5" />
                </motion.div>
              </Button>

              {/* Dismiss */}
              <button
                type="button"
                onClick={onDismiss}
                className="shrink-0 rounded-md p-1.5 text-muted-foreground/60 transition-colors hover:bg-muted/60 hover:text-foreground max-sm:absolute max-sm:right-2 max-sm:top-2"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
