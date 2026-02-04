import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Account, CURRENCY_META, PayoutCurrency } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Display helpers
export function formatAccountIdentifier(account: Account): string {
  if (account.type === "bank" && account.lastFour) {
    return `•••${account.lastFour}`;
  }
  if (account.type === "crypto" && account.walletAddress) {
    const addr = account.walletAddress;
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  }
  return "";
}

export function formatLastUsed(date?: Date): string {
  if (!date) return "Never";

  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }
  const years = Math.floor(days / 365);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

export function formatAmount(amount: number, currency: PayoutCurrency): string {
  const meta = CURRENCY_META[currency];
  if (meta?.type === "fiat") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return `${amount.toLocaleString()} ${currency.toUpperCase()}`;
}


export function formatSeconds(seconds: number) {
  return `0:${String(seconds).padStart(2, "0")}`;
}