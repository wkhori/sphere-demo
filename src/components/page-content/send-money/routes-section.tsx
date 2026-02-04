"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PayoutCurrency } from "@/lib/types";
import type {
  LockedRateMap,
  RateDirectionMap,
  TransferRoute,
} from "@/lib/send-money/types";
import { ROUTE_REFRESH_INTERVAL_MS } from "@/lib/send-money/constants";
import { RouteCard } from "./route-card";

type RoutesSectionProps = {
  amount: number;
  fromCurrency?: PayoutCurrency;
  toCurrency?: PayoutCurrency;
  displayedRoutes: TransferRoute[];
  selectedRouteId: string | null;
  lockedRoutes: LockedRateMap;
  rateDirection: RateDirectionMap;
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
  amount,
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
  const [refreshCycle, setRefreshCycle] = React.useState(0);
  const refreshIntervalRef = React.useRef<ReturnType<
    typeof setInterval
  > | null>(null);

  const clearRefreshTimer = React.useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
  }, []);

  const restartRefreshTimer = React.useCallback(() => {
    clearRefreshTimer();
    refreshIntervalRef.current = setInterval(() => {
      setRefreshCycle((prev) => prev + 1);
    }, ROUTE_REFRESH_INTERVAL_MS);
  }, [clearRefreshTimer]);

  React.useEffect(() => {
    restartRefreshTimer();
    return clearRefreshTimer;
  }, [clearRefreshTimer, restartRefreshTimer]);

  const handleRefreshClick = React.useCallback(() => {
    onRefreshRoutes();
    setRefreshCycle((prev) => prev + 1);
    restartRefreshTimer();
  }, [onRefreshRoutes, restartRefreshTimer]);

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
              onClick={handleRefreshClick}
              disabled={!fromCurrency || !toCurrency}
              aria-label="Refresh routes"
            >
              <RefreshCountdown cycleKey={refreshCycle} />
            </Button>
          </div>

          <div className="mt-2 space-y-2">
            {displayedRoutes.length
              ? displayedRoutes.map((route) => {
                  return (
                    <RouteCard
                      key={route.id}
                      route={route}
                      isSelected={selectedRouteId === route.id}
                      lockedRate={lockedRoutes[route.id]}
                      now={now}
                      amount={amount}
                      direction={rateDirection[route.id] ?? null}
                      onSelect={onSelectRoute}
                      onLock={onLockRoute}
                    />
                  );
                })
              : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
