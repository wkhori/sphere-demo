"use client";

import * as React from "react";
import { ArrowRight, Lock } from "lucide-react";
import { AssetIcon } from "@/components/ui/asset-icon";
import { AnimatedNumber } from "@/components/motion-primitives/animated-number";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PayoutCurrency } from "@/lib/types";
import { cn, formatSeconds } from "@/lib/utils";
import type { LockedRate, TransferRoute } from "@/hooks/use-send-money-routes";
import { RouteTag } from "./route-tag";

const SEPA_CURRENCIES = [PayoutCurrency.EUR, PayoutCurrency.GBP];

const getFallbackRailLabel = (from: PayoutCurrency, to: PayoutCurrency) => {
  if ([from, to].includes(PayoutCurrency.USD)) {
    return "ACH";
  }
  if ([from, to].some((currency) => SEPA_CURRENCIES.includes(currency))) {
    return "SEPA";
  }
  return "Wire";
};

export type RouteCardProps = {
  route: TransferRoute;
  isSelected: boolean;
  lockedRate?: LockedRate;
  now: number;
  amountValue: number;
  direction: "up" | "down" | null;
  onSelect: (routeId: string) => void;
  onLock: (routeId: string, currentRate: number) => void;
};

export function RouteCard({
  route,
  isSelected,
  lockedRate,
  now,
  amountValue,
  direction,
  onSelect,
  onLock,
}: RouteCardProps) {
  const isLocked = lockedRate && lockedRate.expiresAt.getTime() > now;
  const displayRate = isLocked ? lockedRate.rate : route.rate;
  const remaining = isLocked
    ? Math.max(0, Math.ceil((lockedRate.expiresAt.getTime() - now) / 1000))
    : 0;
  const feeAmount = amountValue * route.feePercent;

  return (
    <Card
      className={cn(
        "hover:cursor-pointer border border-border/20 bg-muted/10 shadow-none py-3",
        isSelected && "border-primary/50 bg-muted/20",
      )}
      onClick={() => onSelect(route.id)}
    >
      <CardContent className="px-3 flex flex-col hover:cursor-pointer">
        <div className="flex items-center justify-between">
          <RouteTag tag={route.tag} />
          <div className="flex items-center">
            {isLocked && remaining > 0 ? (
              <span className="text-xs text-muted-foreground">
                {formatSeconds(remaining)}
              </span>
            ) : null}
            <Button
              variant="ghost"
              size="icon-sm"
              className="cursor-pointer"
              onClick={(event) => {
                event.stopPropagation();
                if (isLocked) return;
                onLock(route.id, displayRate);
              }}
            >
              <Lock className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="my-3 flex flex-wrap items-center gap-3 justify-center">
          {route.steps.map((step, index) => (
            <React.Fragment key={`${route.id}-${step}-${index}`}>
              <div className="flex items-center gap-1">
                <AssetIcon type="currency" currency={step} size="md" />
                <span className="text-md font-medium">
                  {step.toUpperCase()}
                </span>
              </div>
              {index < route.steps.length - 1 ? (
                <>
                  <span className="text-xs text-muted-foreground rounded bg-muted px-2 py-0.5">
                    {route.rails[index] === "Sphere"
                      ? getFallbackRailLabel(step, route.steps[index + 1])
                      : route.rails[index]}
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </>
              ) : null}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-3 sm:gap-3">
          <div className="flex items-center gap-1">
            Rate:
            <span
              className={cn(
                "font-medium text-foreground",
                direction === "up" && "text-emerald-600",
                direction === "down" && "text-rose-600",
              )}
            >
              <AnimatedNumber
                value={displayRate}
                format={(value) => value.toFixed(4)}
              />
            </span>
          </div>
          <div>
            Fee:{" "}
            <span className="text-foreground font-medium">
              ${feeAmount.toFixed(2)} ({(route.feePercent * 100).toFixed(1)}%)
            </span>
          </div>
          <div>
            ETA:{" "}
            <span className="text-foreground font-medium">{route.eta}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
