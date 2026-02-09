"use client";

import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AssetIcon } from "@/components/ui/asset-icon";
import { AnimatedNumber } from "@/components/motion-primitives/animated-number";
import { PayoutCurrency } from "@/lib/types";

export function CustomComponentsSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Transfer Routes</h2>
        <p className="text-sm text-muted-foreground">
          Route cards shown during the Send Money flow. Notice how brand colors
          appear on borders, rail labels, and rate indicators.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="border border-primary/50 bg-muted/20 shadow-none py-3">
          <CardContent className="px-3 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize bg-primary/15 text-primary border border-primary/40">
                <CheckCircle2 className="h-3.5 w-3.5" />
                best value
              </span>
              <Button variant="ghost" size="icon-sm">
                <Lock className="h-4 w-4" />
              </Button>
            </div>
            <div className="my-3 flex flex-wrap items-center gap-3 justify-center">
              <div className="flex items-center gap-1">
                <AssetIcon type="currency" currency={PayoutCurrency.USD} size="md" />
                <span className="text-md font-medium">USD</span>
              </div>
              <span className="text-xs text-primary rounded border border-primary/30 px-2 py-0.5">
                SWIFT
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <div className="flex items-center gap-1">
                <AssetIcon type="currency" currency={PayoutCurrency.USDC} size="md" />
                <span className="text-md font-medium">USDC</span>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                Rate:
                <span className="font-medium text-trend-positive">
                  <AnimatedNumber value={1.0012} format={(v) => v.toFixed(4)} />
                </span>
              </div>
              <div>
                Fee: <span className="text-foreground font-medium">$2.50 (0.5%)</span>
              </div>
              <div>
                ETA: <span className="text-foreground font-medium">~2 min</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/20 bg-muted/10 shadow-none py-3">
          <CardContent className="px-3 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize bg-secondary text-secondary-foreground border border-secondary">
                <Zap className="h-3.5 w-3.5" />
                quickest
              </span>
              <Button variant="ghost" size="icon-sm">
                <Lock className="h-4 w-4" />
              </Button>
            </div>
            <div className="my-3 flex flex-wrap items-center gap-3 justify-center">
              <div className="flex items-center gap-1">
                <AssetIcon type="currency" currency={PayoutCurrency.EUR} size="md" />
                <span className="text-md font-medium">EUR</span>
              </div>
              <span className="text-xs text-primary rounded border border-primary/30 px-2 py-0.5">
                SEPA
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <div className="flex items-center gap-1">
                <AssetIcon type="currency" currency={PayoutCurrency.GBP} size="md" />
                <span className="text-md font-medium">GBP</span>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                Rate:
                <span className="font-medium text-trend-negative">
                  <AnimatedNumber value={0.8721} format={(v) => v.toFixed(4)} />
                </span>
              </div>
              <div>
                Fee: <span className="text-foreground font-medium">€1.20 (0.3%)</span>
              </div>
              <div>
                ETA: <span className="text-foreground font-medium">~30 sec</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </section>
  );
}
