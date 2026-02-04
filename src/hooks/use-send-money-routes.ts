"use client";

import * as React from "react";
import { computeFxSeed } from "@/lib/fx";
import type {
  LockedRateMap,
  RateDirectionMap,
  TransferRoute,
} from "@/lib/send-money/types";
import {
  applyRateTick,
  createRoutes,
  getLockedRate,
  tagAndSortRoutes,
} from "@/lib/send-money/routes";
import {
  LOCK_CHECK_INTERVAL_MS,
  RATE_LOCK_MS,
  ROUTE_REFRESH_INTERVAL_MS,
} from "@/lib/send-money/constants";
import type { PayoutCurrency } from "@/lib/types";
import { useInterval } from "@/hooks/use-interval";

export function useSendMoneyRoutes({
  fromCurrency,
  toCurrency,
}: {
  fromCurrency?: PayoutCurrency;
  toCurrency?: PayoutCurrency;
}) {
  const [routes, setRoutes] = React.useState<TransferRoute[]>([]);
  const [lockedRoutes, setLockedRoutes] = React.useState<LockedRateMap>({});
  const [rateDirection, setRateDirection] = React.useState<RateDirectionMap>(
    {},
  );
  const [selectedRouteId, setSelectedRouteId] = React.useState<string | null>(
    null,
  );
  const [now, setNow] = React.useState(() => Date.now());
  const rateDirectionTimeout = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const rateTickRef = React.useRef(0);

  const seed = React.useMemo(() => {
    if (!fromCurrency || !toCurrency) return null;
    return computeFxSeed(fromCurrency, toCurrency);
  }, [fromCurrency, toCurrency]);

  const resetRouteState = React.useCallback(
    (options?: { clearRoutes?: boolean }) => {
      setSelectedRouteId(null);
      setLockedRoutes({});
      setRateDirection({});
      rateTickRef.current = 0;
      if (options?.clearRoutes) {
        setRoutes([]);
      }
    },
    [],
  );

  const rebuildRoutes = React.useCallback(() => {
    if (!fromCurrency || !toCurrency || seed === null) {
      resetRouteState({ clearRoutes: true });
      return;
    }
    resetRouteState();
    setRoutes(createRoutes(fromCurrency, toCurrency, seed));
  }, [fromCurrency, toCurrency, seed, resetRouteState]);

  const handleRefreshRoutes = React.useCallback(() => {
    rebuildRoutes();
  }, [rebuildRoutes]);

  React.useEffect(() => {
    rebuildRoutes();
  }, [rebuildRoutes]);

  const displayedRoutes = React.useMemo(
    () => tagAndSortRoutes(routes),
    [routes],
  );

  React.useEffect(() => {
    if (!displayedRoutes.length) return;
    const hasSelected = displayedRoutes.some(
      (route) => route.id === selectedRouteId,
    );
    if (!selectedRouteId || !hasSelected) {
      const best = displayedRoutes.find((route) => route.tag === "best value");
      if (best) {
        setSelectedRouteId(best.id);
      }
    }
  }, [displayedRoutes, selectedRouteId]);

  useInterval(
    () => {
      if (!routes.length || seed === null) return;
      const nowTime = Date.now();
      rateTickRef.current += 1;

      const { nextRoutes, directions } = applyRateTick(
        routes,
        seed,
        rateTickRef.current,
        lockedRoutes,
        nowTime,
      );

      setRoutes(nextRoutes);

      if (Object.keys(directions).length) {
        setRateDirection((prev) => ({ ...prev, ...directions }));
        if (rateDirectionTimeout.current) {
          clearTimeout(rateDirectionTimeout.current);
        }
        rateDirectionTimeout.current = setTimeout(() => {
          setRateDirection((prev) => {
            const updated = { ...prev };
            Object.keys(directions).forEach((key) => {
              updated[key] = null;
            });
            return updated;
          });
        }, 1000);
      }
    },
    ROUTE_REFRESH_INTERVAL_MS,
    routes.length > 0 && seed !== null,
  );

  useInterval(
    () => {
      if (!Object.keys(lockedRoutes).length) return;
      const nowTime = Date.now();
      setNow(nowTime);
      setLockedRoutes((prev) => {
        let changed = false;
        const updated: LockedRateMap = { ...prev };
        Object.entries(prev).forEach(([key, value]) => {
          if (value.expiresAt.getTime() <= nowTime) {
            delete updated[key];
            changed = true;
          }
        });
        return changed ? updated : prev;
      });
    },
    LOCK_CHECK_INTERVAL_MS,
    Object.keys(lockedRoutes).length > 0,
  );

  const handleLockRoute = React.useCallback(
    (routeId: string, currentRate: number) => {
      const nowTime = Date.now();
      setNow(nowTime);
      setLockedRoutes((prev) => ({
        ...prev,
        [routeId]: {
          rate: currentRate,
          expiresAt: new Date(nowTime + RATE_LOCK_MS),
        },
      }));
    },
    [],
  );

  React.useEffect(() => {
    return () => {
      if (rateDirectionTimeout.current) {
        clearTimeout(rateDirectionTimeout.current);
      }
    };
  }, []);

  const selectedRoute = routes.find((route) => route.id === selectedRouteId);
  const effectiveRate = selectedRoute
    ? (getLockedRate(lockedRoutes, selectedRoute.id, now) ?? selectedRoute.rate)
    : null;

  return {
    displayedRoutes,
    selectedRouteId,
    setSelectedRouteId,
    lockedRoutes,
    rateDirection,
    now,
    handleRefreshRoutes,
    handleLockRoute,
    effectiveRate,
  };
}
