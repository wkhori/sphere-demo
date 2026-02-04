"use client";

import * as React from "react";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, Lock, Zap } from "lucide-react";

import { AssetIcon } from "@/components/ui/asset-icon";
import { AnimatedNumber } from "@/components/motion-primitives/animated-number";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PayoutCurrency } from "@/lib/types";
import { cn, formatSeconds } from "@/lib/utils";

import type { LockedRate, TransferRoute } from "./use-send-money-routes";
import { ROUTE_REFRESH_INTERVAL_MS } from "./use-send-money-routes";

const RouteTag = ({ tag }: { tag?: TransferRoute["tag"] }) => {
  if (!tag) {
    return <span />;
  }

  const isBest = tag === "best value";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        isBest
          ? "bg-emerald-500/8 text-emerald-700 border border-emerald-500/15 dark:text-emerald-300 dark:bg-emerald-400/10 dark:border-emerald-400/20"
          : "bg-amber-500/8 text-amber-800 border border-amber-500/15 dark:text-amber-300 dark:bg-amber-400/10 dark:border-amber-400/20",
      )}
    >
      {isBest ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <Zap className="h-3.5 w-3.5" />
      )}
      {isBest ? "best value" : "quickest"}
    </span>
  );
};

type RoutesSectionProps = {
  amountValue: number;
  fromCurrency?: PayoutCurrency;
  toCurrency?: PayoutCurrency;
  displayedRoutes: TransferRoute[];
  selectedRouteId: string | null;
  lockedRoutes: Record<string, LockedRate>;
  rateDirection: Record<string, "up" | "down" | null>;
  now: number;
  onSelectRoute: (routeId: string) => void;
  onRefreshRoutes: () => void;
  onLockRoute: (routeId: string, currentRate: number) => void;
};

const RefreshCountdown = ({ cycleKey }: { cycleKey: number }) => {
  const radius = 8.5;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 text-muted-foreground"
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="2"
      />
      <motion.circle
        key={cycleKey}
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: 0 }}
        transition={{
          duration: ROUTE_REFRESH_INTERVAL_MS / 1000,
          ease: "linear",
        }}
        transform="rotate(-90 12 12)"
      />
    </svg>
  );
};

export function RoutesSection({
  amountValue,
  fromCurrency,
  toCurrency,
  displayedRoutes,
  selectedRouteId,
  lockedRoutes,
  rateDirection,
  now,
  onSelectRoute,
  onRefreshRoutes,
  onLockRoute,
}: RoutesSectionProps) {
  const refreshInterval = ROUTE_REFRESH_INTERVAL_MS;
  const [refreshCycle, setRefreshCycle] = React.useState(0);
  const refreshIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const startRefreshTimer = React.useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
    refreshIntervalRef.current = setInterval(() => {
      setRefreshCycle((prev) => prev + 1);
    }, refreshInterval);
  }, [refreshInterval]);

  React.useEffect(() => {
    startRefreshTimer();
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [startRefreshTimer]);

  return (
    <Card className="border-0 bg-transparent py-0! gap-0">
      <CardContent className="p-0">
        <div className="p-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Routes</h2>
            <p className="text-muted-foreground text-xs">
              Compare all available routes for this transfer
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="cursor-pointer"
            onClick={() => {
              onRefreshRoutes();
              setRefreshCycle((prev) => prev + 1);
              startRefreshTimer();
            }}
            disabled={!fromCurrency || !toCurrency}
            aria-label="Refresh routes"
          >
            <RefreshCountdown cycleKey={refreshCycle} />
          </Button>
        </div>

        <div className="mt-2 space-y-2">
          {displayedRoutes.length ? (
            displayedRoutes.map((route) => {
              const locked = lockedRoutes[route.id];
              const isLocked = locked && locked.expiresAt.getTime() > now;
              const displayRate = isLocked ? locked.rate : route.rate;
              const remaining = isLocked
                ? Math.max(0, Math.ceil((locked.expiresAt.getTime() - now) / 1000))
                : 0;
              const feeAmount = amountValue
                ? amountValue * route.feePercent
                : 0;
              const isSelected = selectedRouteId === route.id;
              const direction = rateDirection[route.id];

              return (
                <div key={route.id}>
                  <Card
                    className={cn(
                      "hover:cursor-pointer border border-border/20 bg-muted/10 shadow-none py-3",
                      isSelected && "border-primary/50 bg-muted/20",
                    )}
                    onClick={() => onSelectRoute(route.id)}
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
                              onLockRoute(route.id, displayRate);
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
                              <AssetIcon
                                type="currency"
                                currency={step}
                                size="md"
                              />
                              <span className="text-md font-medium">
                                {step.toUpperCase()}
                              </span>
                            </div>
                            {index < route.steps.length - 1 ? (
                              <>
                                <span className="text-xs text-muted-foreground rounded bg-muted px-2 py-0.5">
                                  {route.rails[index] === "Sphere"
                                    ? [step, route.steps[index + 1]].includes(
                                        PayoutCurrency.USD,
                                      )
                                      ? "ACH"
                                      : [step, route.steps[index + 1]].some(
                                          (currency) =>
                                            [
                                              PayoutCurrency.EUR,
                                              PayoutCurrency.GBP,
                                            ].includes(currency),
                                        )
                                        ? "SEPA"
                                        : "Wire"
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
                            ${feeAmount.toFixed(2)} (
                            {(route.feePercent * 100).toFixed(1)}%)
                          </span>
                        </div>
                        <div>
                          ETA:{" "}
                          <span className="text-foreground font-medium">
                            {route.eta}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })
          ) : null}
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
