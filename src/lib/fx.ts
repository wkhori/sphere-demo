import { CURRENCY_META, PayoutCurrency } from "./types";

export const STATIC_FX_RATES: Partial<Record<PayoutCurrency, number>> = {
  [PayoutCurrency.USD]: 1,
  [PayoutCurrency.USDC]: 1,
  [PayoutCurrency.USDT]: 1,
  [PayoutCurrency.MXN]: 17.4,
  [PayoutCurrency.BRL]: 5.27,
};

export const computeFxSeed = (from: PayoutCurrency, to: PayoutCurrency) =>
  `${from}-${to}`.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

export const getBaseFxRate = (from: PayoutCurrency, to: PayoutCurrency) => {
  if (from === to) return 1;

  const fromStatic = STATIC_FX_RATES[from];
  const toStatic = STATIC_FX_RATES[to];
  if (fromStatic && toStatic) {
    return toStatic / fromStatic;
  }

  const fromMeta = CURRENCY_META[from];
  const toMeta = CURRENCY_META[to];
  const seed = computeFxSeed(from, to);
  const fxBase = 0.82 + (seed % 35) / 100;

  if (fromMeta?.type === "fiat" && toMeta?.type === "fiat") {
    return fxBase;
  }

  const stable = new Set<PayoutCurrency>([
    PayoutCurrency.USDC,
    PayoutCurrency.USDT,
  ]);
  if (stable.has(from) || stable.has(to)) {
    return 1;
  }

  return 1 + ((seed % 12) - 6) / 100;
};
