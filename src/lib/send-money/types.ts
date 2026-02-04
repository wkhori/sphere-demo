import type { PayoutCurrency } from "@/lib/types";

export type RouteTag = "best value" | "quickest";

export type TransferRoute = {
  id: string;
  name: string;
  tag?: RouteTag;
  rate: number;
  baseRate: number;
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

export type LockedRateMap = Record<string, LockedRate>;
export type RateDirection = "up" | "down" | null;
export type RateDirectionMap = Record<string, RateDirection>;
