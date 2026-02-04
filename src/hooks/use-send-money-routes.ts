"use client";

import * as React from "react";
import {
  CURRENCY_META,
  CURRENCY_RAIL_HINT,
  NETWORK_META,
  PayoutCurrency,
  PayoutNetwork,
} from "@/lib/types";
import { computeFxSeed, getBaseFxRate } from "@/lib/fx";

type RouteTag = "best value" | "quickest";

export type TransferRoute = {
  id: string;
  name: string;
  tag?: RouteTag;
  rate: number;
  feePercent: number;
  eta: string;
  speedScore: number;
  steps: PayoutCurrency[];
  rails: string[];
};

export interface LockedRate {
  rate: number;
  expiresAt: Date;
}

export const ROUTE_REFRESH_INTERVAL_MS = 5000;

const FIAT_RAILS = ["ACH", "Wire", "SWIFT", "SPEI", "PIX"];
const CRYPTO_RAILS = [
  PayoutNetwork.SOL,
  PayoutNetwork.ETH,
  PayoutNetwork.BASE,
  PayoutNetwork.POLYGON,
];
const FX_JITTER_RANGE = 0.004;
const FIAT_ETA_OPTIONS = [
  "4-6 hours",
  "1-2 days",
  "2-3 days",
  "3-5 days",
  "5-7 days",
];
const CRYPTO_ETA_OPTIONS = [
  "5-15 min",
  "30-60 min",
  "2-4 hours",
  "6-12 hours",
  "1 day",
];

const pickBridgeCurrency = (
  from: PayoutCurrency,
  to: PayoutCurrency,
  seed: number,
) => {
  const candidates = [
    PayoutCurrency.USDC,
    PayoutCurrency.USDT,
    PayoutCurrency.USD,
    PayoutCurrency.MXN,
    PayoutCurrency.BRL,
  ];
  let index = seed % candidates.length;
  let bridge = candidates[index];
  while (bridge === from || bridge === to) {
    index = (index + 1) % candidates.length;
    bridge = candidates[index];
  }
  return bridge;
};

const pickRailLabel = (
  from: PayoutCurrency,
  to: PayoutCurrency,
  seed: number,
) => {
  const fromMeta = CURRENCY_META[from];
  const toMeta = CURRENCY_META[to];
  if (fromMeta?.type !== toMeta?.type) {
    return CURRENCY_RAIL_HINT[from] ?? CURRENCY_RAIL_HINT[to] ?? "Wire";
  }
  if (fromMeta?.type === "crypto" || toMeta?.type === "crypto") {
    const network = CRYPTO_RAILS[seed % CRYPTO_RAILS.length];
    return NETWORK_META[network].label;
  }
  return FIAT_RAILS[seed % FIAT_RAILS.length];
};

const buildRouteSteps = (
  from: PayoutCurrency,
  to: PayoutCurrency,
  seed: number,
  index: number,
) => {
  if (from === to) {
    return { steps: [from], rails: [] };
  }

  const fromMeta = CURRENCY_META[from];
  const toMeta = CURRENCY_META[to];
  const crossType = fromMeta?.type !== toMeta?.type;
  const useBridge = (seed + index) % 2 === 0 || crossType;

  const steps: PayoutCurrency[] = [from];
  if (useBridge) {
    steps.push(pickBridgeCurrency(from, to, seed + index));
  }
  steps.push(to);

  const rails = steps
    .slice(0, -1)
    .map((step, i) => pickRailLabel(step, steps[i + 1], seed + i + index));

  return { steps, rails };
};

const getRouteCount = (from: PayoutCurrency, to: PayoutCurrency) => {
  if (from === to) return 1;
  const seed = computeFxSeed(from, to);
  const fromMeta = CURRENCY_META[from];
  const toMeta = CURRENCY_META[to];
  const crossType = fromMeta?.type !== toMeta?.type;

  if (fromMeta?.type === "crypto" && toMeta?.type === "crypto") {
    return 2 + (seed % 3);
  }
  if (crossType) {
    return 3 + (seed % 3);
  }
  return 2 + (seed % 4);
};

const generateRoutes = (
  fromCurrency: PayoutCurrency,
  toCurrency: PayoutCurrency,
): TransferRoute[] => {
  const seed = computeFxSeed(fromCurrency, toCurrency);
  const baseRate = getBaseFxRate(fromCurrency, toCurrency);
  const jitter = ((seed % 9) - 4) * FX_JITTER_RANGE;
  const jitteredRate = baseRate * (1 + jitter);
  const count = getRouteCount(fromCurrency, toCurrency);
  const names = [
    "Express Transfer",
    "Standard Transfer",
    "Wire Transfer",
    "Priority Transfer",
    "Economy Transfer",
  ];

  const fromMeta = CURRENCY_META[fromCurrency];
  const toMeta = CURRENCY_META[toCurrency];
  const isCryptoPair = fromMeta?.type === "crypto" || toMeta?.type === "crypto";

  const etaOptions = isCryptoPair ? CRYPTO_ETA_OPTIONS : FIAT_ETA_OPTIONS;

  return Array.from({ length: count }).map((_, index) => {
    const modifier = (index - (count - 1) / 2) * 0.0015;
    const rate = jitteredRate * (1 + modifier);
    const feeBase = isCryptoPair ? 0.003 : 0.006;
    const feePercent = feeBase + (count - index - 1) * 0.002;
    const { steps, rails } = buildRouteSteps(
      fromCurrency,
      toCurrency,
      seed,
      index,
    );

    return {
      id: `${names[index] ?? "route"}-${index}`
        .toLowerCase()
        .replace(/\s+/g, "-"),
      name: names[index] ?? `Route ${index + 1}`,
      rate,
      feePercent,
      eta: etaOptions[Math.min(index, etaOptions.length - 1)],
      speedScore: index + 1,
      steps,
      rails,
    };
  });
};

const getLockedRate = (
  lockedRoutes: Record<string, LockedRate>,
  routeId: string,
  now: number,
) => {
  const locked = lockedRoutes[routeId];
  if (!locked) return null;
  if (locked.expiresAt.getTime() <= now) return null;
  return locked.rate;
};

export function useSendMoneyRoutes({
  fromCurrency,
  toCurrency,
}: {
  fromCurrency?: PayoutCurrency;
  toCurrency?: PayoutCurrency;
}) {
  const [routes, setRoutes] = React.useState<TransferRoute[]>([]);
  const [lockedRoutes, setLockedRoutes] = React.useState<
    Record<string, LockedRate>
  >({});
  const [rateDirection, setRateDirection] = React.useState<
    Record<string, "up" | "down" | null>
  >({});
  const [selectedRouteId, setSelectedRouteId] = React.useState<string | null>(
    null,
  );
  const [now, setNow] = React.useState(() => Date.now());
  const rateDirectionTimeout = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const resetRouteState = React.useCallback(
    (options?: { clearRoutes?: boolean }) => {
      setSelectedRouteId(null);
      setLockedRoutes({});
      setRateDirection({});
      if (options?.clearRoutes) {
        setRoutes([]);
      }
    },
    [],
  );

  const updateRoutes = React.useCallback(() => {
    if (!fromCurrency || !toCurrency) {
      resetRouteState({ clearRoutes: true });
      return;
    }
    setRoutes(generateRoutes(fromCurrency, toCurrency));
  }, [fromCurrency, toCurrency, resetRouteState]);

  const handleRefreshRoutes = React.useCallback(() => {
    if (!fromCurrency || !toCurrency) {
      resetRouteState({ clearRoutes: true });
      return;
    }
    resetRouteState();
    updateRoutes();
  }, [fromCurrency, toCurrency, resetRouteState, updateRoutes]);

  React.useEffect(() => {
    if (!fromCurrency || !toCurrency) {
      resetRouteState({ clearRoutes: true });
      return;
    }
    resetRouteState();
    updateRoutes();
  }, [fromCurrency, toCurrency, resetRouteState, updateRoutes]);

  const displayedRoutes = React.useMemo(() => {
    const tagged = routes.map((route) => ({ ...route }));
    if (!tagged.length) return tagged;

    const cheapest = tagged.reduce((min, r) =>
      r.feePercent < min.feePercent ? r : min,
    );
    const fastestCandidate = tagged.filter((route) => route.id !== cheapest.id);
    const fastest =
      fastestCandidate.length > 0
        ? fastestCandidate.reduce((min, r) =>
            r.speedScore < min.speedScore ? r : min,
          )
        : cheapest;
    tagged.forEach((route) => {
      if (route.id === cheapest.id) route.tag = "best value";
      else if (route.id === fastest.id) route.tag = "quickest";
      else route.tag = undefined;
    });

    const sorted = [...tagged].sort((a, b) => {
      if (a.feePercent === b.feePercent) {
        return a.speedScore - b.speedScore;
      }
      return a.feePercent - b.feePercent;
    });
    const best = sorted.find((route) => route.tag === "best value");
    const quickest = sorted.find(
      (route) => route.tag === "quickest" && route.id !== best?.id,
    );
    const rest = sorted.filter(
      (route) => route.id !== best?.id && route.id !== quickest?.id,
    );

    return [best, quickest, ...rest].filter(Boolean) as TransferRoute[];
  }, [routes]);

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

  React.useEffect(() => {
    if (!routes.length) return;
    const interval = setInterval(() => {
      const nowTime = Date.now();
      const changes: Record<string, "up" | "down"> = {};
      setRoutes((prev) =>
        prev.map((route) => {
          const locked = lockedRoutes[route.id];
          const isLocked = locked && locked.expiresAt.getTime() > nowTime;
          if (isLocked) {
            return route;
          }
          const nextRate = route.rate * (1 + (Math.random() - 0.5) * 0.01);
          if (nextRate > route.rate) changes[route.id] = "up";
          if (nextRate < route.rate) changes[route.id] = "down";
          return { ...route, rate: nextRate };
        }),
      );

      if (Object.keys(changes).length) {
        setRateDirection((prev) => ({ ...prev, ...changes }));
        if (rateDirectionTimeout.current) {
          clearTimeout(rateDirectionTimeout.current);
        }
        rateDirectionTimeout.current = setTimeout(() => {
          setRateDirection((prev) => {
            const updated = { ...prev };
            Object.keys(changes).forEach((key) => {
              updated[key] = null;
            });
            return updated;
          });
        }, 1000);
      }
    }, ROUTE_REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [lockedRoutes, routes.length]);

  React.useEffect(() => {
    if (!Object.keys(lockedRoutes).length) return undefined;
    const interval = setInterval(() => {
      setNow(Date.now());
      setLockedRoutes((prev) => {
        let changed = false;
        const updated: Record<string, LockedRate> = { ...prev };
        Object.entries(prev).forEach(([key, value]) => {
          if (value.expiresAt.getTime() <= Date.now()) {
            delete updated[key];
            changed = true;
          }
        });
        return changed ? updated : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockedRoutes]);

  const handleLockRoute = React.useCallback(
    (routeId: string, currentRate: number) => {
      setNow(Date.now());
      setLockedRoutes((prev) => ({
        ...prev,
        [routeId]: {
          rate: currentRate,
          expiresAt: new Date(Date.now() + 30000),
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
