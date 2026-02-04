import {
  CURRENCY_META,
  CURRENCY_RAIL_HINT,
  NETWORK_META,
  PayoutCurrency,
  PayoutNetwork,
} from "@/lib/types";
import { getBaseFxRate } from "@/lib/fx";
import type {
  LockedRateMap,
  RateDirection,
  TransferRoute,
} from "@/lib/send-money/types";

const FIAT_RAILS = ["ACH", "Wire", "SWIFT", "SPEI", "PIX"];
const CRYPTO_RAILS = [
  PayoutNetwork.SOL,
  PayoutNetwork.ETH,
  PayoutNetwork.BASE,
  PayoutNetwork.POLYGON,
];
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
const ROUTE_NAMES = [
  "Express Transfer",
  "Standard Transfer",
  "Wire Transfer",
  "Priority Transfer",
  "Economy Transfer",
];

const RATE_WAVE_PERIOD = 12;
const RATE_WAVE_AMPLITUDE = 0.004;

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
  const useBridge = crossType || (seed + index) % 2 === 0;

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

const getRouteCount = (
  from: PayoutCurrency,
  to: PayoutCurrency,
  seed: number,
) => {
  if (from === to) return 1;
  const fromMeta = CURRENCY_META[from];
  const toMeta = CURRENCY_META[to];
  const crossType = fromMeta?.type !== toMeta?.type;
  const isCryptoPair = fromMeta?.type === "crypto" || toMeta?.type === "crypto";

  if (isCryptoPair) return 2;
  if (crossType) return 3;
  return 2 + (seed % 2);
};

const getRateForTick = (
  baseRate: number,
  seed: number,
  index: number,
  tick: number,
) => {
  const phase = (seed + index * 7 + tick) % RATE_WAVE_PERIOD;
  const normalized = phase / (RATE_WAVE_PERIOD - 1);
  const wave = (normalized - 0.5) * 2;
  return baseRate * (1 + wave * RATE_WAVE_AMPLITUDE);
};

export const createRoutes = (
  fromCurrency: PayoutCurrency,
  toCurrency: PayoutCurrency,
  seed: number,
): TransferRoute[] => {
  const baseRate = getBaseFxRate(fromCurrency, toCurrency);
  const count = getRouteCount(fromCurrency, toCurrency, seed);

  const fromMeta = CURRENCY_META[fromCurrency];
  const toMeta = CURRENCY_META[toCurrency];
  const isCryptoPair = fromMeta?.type === "crypto" || toMeta?.type === "crypto";
  const etaOptions = isCryptoPair ? CRYPTO_ETA_OPTIONS : FIAT_ETA_OPTIONS;

  return Array.from({ length: count }).map((_, index) => {
    const modifier = (index - (count - 1) / 2) * 0.0015;
    const baseRouteRate = baseRate * (1 + modifier);
    const feeBase = isCryptoPair ? 0.003 : 0.006;
    const feePercent = feeBase + (count - index - 1) * 0.002;
    const { steps, rails } = buildRouteSteps(
      fromCurrency,
      toCurrency,
      seed,
      index,
    );

    return {
      id: `${ROUTE_NAMES[index] ?? "route"}-${index}`
        .toLowerCase()
        .replace(/\s+/g, "-"),
      name: ROUTE_NAMES[index] ?? `Route ${index + 1}`,
      baseRate: baseRouteRate,
      rate: baseRouteRate,
      feePercent,
      eta: etaOptions[Math.min(index, etaOptions.length - 1)],
      speedScore: index + 1,
      steps,
      rails,
    };
  });
};

export const tagAndSortRoutes = (routes: TransferRoute[]) => {
  if (!routes.length) return [] as TransferRoute[];

  const tagged = routes.map((route) => ({ ...route }));
  const cheapest = tagged.reduce((min, route) =>
    route.feePercent < min.feePercent ? route : min,
  );
  const fastestCandidate = tagged.filter((route) => route.id !== cheapest.id);
  const fastest =
    fastestCandidate.length > 0
      ? fastestCandidate.reduce((min, route) =>
          route.speedScore < min.speedScore ? route : min,
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
};

export const getLockedRate = (
  lockedRoutes: LockedRateMap,
  routeId: string,
  now: number,
) => {
  const locked = lockedRoutes[routeId];
  if (!locked) return null;
  if (locked.expiresAt.getTime() <= now) return null;
  return locked.rate;
};

export const applyRateTick = (
  routes: TransferRoute[],
  seed: number,
  tick: number,
  lockedRoutes: LockedRateMap,
  now: number,
) => {
  const directions: Record<string, Exclude<RateDirection, null>> = {};
  const nextRoutes = routes.map((route, index) => {
    const locked = lockedRoutes[route.id];
    const isLocked = locked && locked.expiresAt.getTime() > now;
    if (isLocked) {
      return route;
    }
    const nextRate = getRateForTick(route.baseRate, seed, index, tick);
    if (nextRate > route.rate) directions[route.id] = "up";
    if (nextRate < route.rate) directions[route.id] = "down";
    return { ...route, rate: nextRate };
  });

  return { nextRoutes, directions };
};
