import { getBaseFxRate } from "@/lib/fx";
import { CURRENCY_META, type PayoutCurrency } from "@/lib/types";

export const parseAmountInput = (input: string) => {
  const normalized = input.replace(/,/g, "");
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? value : 0;
};

export const convertAmount = (
  amount: number,
  fromCurrency: PayoutCurrency,
  toCurrency: PayoutCurrency,
) => {
  if (fromCurrency === toCurrency) return amount;
  return amount * getBaseFxRate(fromCurrency, toCurrency);
};

export const formatCurrencyValue = (
  amount: number,
  currency: PayoutCurrency,
) => {
  const meta = CURRENCY_META[currency];
  if (meta?.type === "fiat") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2,
    }).format(amount);
  }
  return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
};
