export enum PayoutCurrency {
  USD = "usd",
  EUR = "eur",
  BRL = "brl",
  CAD = "cad",
  COP = "cop",
  IDR = "idr",
  INR = "inr",
  MXN = "mxn",
  PHP = "php",
  SGD = "sgd",
  THB = "thb",
  VND = "vnd",
  GBP = "gbp",
  USDC = "usdc",
  USDT = "usdt",
}

export enum PayoutNetwork {
  WIRE = "wire",
  ACH = "ach",
  ACH_SAME_DAY = "achSameDay",
  SEPA = "sepa",
  SWIFT = "swift",
  PIX = "pix",
  SPEI = "spei",
  NEFT = "neft",
  EFT = "eft",
  FPS = "fps",
  FAST = "fast",
  INSTAPAY = "instapay",
  SOL = "sol",
  ETH = "ethereum",
  POLYGON = "polygon",
  BASE = "base",
  ARBITRUM = "arbitrum",
  AVALANCHE = "avalanche",
  TRON = "tron",
}

export const CURRENCY_META: Record<
  PayoutCurrency,
  {
    label: string;
    symbol: string;
    type: "fiat" | "crypto";
    countryCode?: string;
  }
> = {
  [PayoutCurrency.USD]: {
    label: "US Dollar",
    symbol: "$",
    type: "fiat",
    countryCode: "us",
  },
  [PayoutCurrency.EUR]: {
    label: "Euro",
    symbol: "€",
    type: "fiat",
    countryCode: "eu",
  },
  [PayoutCurrency.BRL]: {
    label: "Brazilian Real",
    symbol: "R$",
    type: "fiat",
    countryCode: "br",
  },
  [PayoutCurrency.MXN]: {
    label: "Mexican Peso",
    symbol: "$",
    type: "fiat",
    countryCode: "mx",
  },
  [PayoutCurrency.GBP]: {
    label: "British Pound",
    symbol: "£",
    type: "fiat",
    countryCode: "gb",
  },
  [PayoutCurrency.CAD]: {
    label: "Canadian Dollar",
    symbol: "$",
    type: "fiat",
    countryCode: "ca",
  },
  [PayoutCurrency.INR]: {
    label: "Indian Rupee",
    symbol: "₹",
    type: "fiat",
    countryCode: "in",
  },
  [PayoutCurrency.PHP]: {
    label: "Philippine Peso",
    symbol: "₱",
    type: "fiat",
    countryCode: "ph",
  },
  [PayoutCurrency.SGD]: {
    label: "Singapore Dollar",
    symbol: "$",
    type: "fiat",
    countryCode: "sg",
  },
  [PayoutCurrency.IDR]: {
    label: "Indonesian Rupiah",
    symbol: "Rp",
    type: "fiat",
    countryCode: "id",
  },
  [PayoutCurrency.THB]: {
    label: "Thai Baht",
    symbol: "฿",
    type: "fiat",
    countryCode: "th",
  },
  [PayoutCurrency.VND]: {
    label: "Vietnamese Dong",
    symbol: "₫",
    type: "fiat",
    countryCode: "vn",
  },
  [PayoutCurrency.COP]: {
    label: "Colombian Peso",
    symbol: "$",
    type: "fiat",
    countryCode: "co",
  },
  [PayoutCurrency.USDC]: { label: "USD Coin", symbol: "$", type: "crypto" },
  [PayoutCurrency.USDT]: { label: "Tether", symbol: "$", type: "crypto" },
};

export const CURRENCY_RAIL_HINT: Partial<Record<PayoutCurrency, string>> = {
  [PayoutCurrency.MXN]: "SPEI",
  [PayoutCurrency.BRL]: "PIX",
};

export const NETWORK_META: Record<
  PayoutNetwork,
  { label: string; type: "fiat" | "crypto" }
> = {
  [PayoutNetwork.ACH]: { label: "ACH", type: "fiat" },
  [PayoutNetwork.ACH_SAME_DAY]: { label: "ACH Same Day", type: "fiat" },
  [PayoutNetwork.WIRE]: { label: "Wire", type: "fiat" },
  [PayoutNetwork.SWIFT]: { label: "SWIFT", type: "fiat" },
  [PayoutNetwork.SEPA]: { label: "SEPA", type: "fiat" },
  [PayoutNetwork.PIX]: { label: "PIX", type: "fiat" },
  [PayoutNetwork.SPEI]: { label: "SPEI", type: "fiat" },
  [PayoutNetwork.NEFT]: { label: "NEFT", type: "fiat" },
  [PayoutNetwork.EFT]: { label: "EFT", type: "fiat" },
  [PayoutNetwork.FPS]: { label: "Faster Payments", type: "fiat" },
  [PayoutNetwork.FAST]: { label: "FAST", type: "fiat" },
  [PayoutNetwork.INSTAPAY]: { label: "InstaPay", type: "fiat" },
  [PayoutNetwork.SOL]: { label: "Solana", type: "crypto" },
  [PayoutNetwork.ETH]: { label: "Ethereum", type: "crypto" },
  [PayoutNetwork.POLYGON]: { label: "Polygon", type: "crypto" },
  [PayoutNetwork.BASE]: { label: "Base", type: "crypto" },
  [PayoutNetwork.ARBITRUM]: { label: "Arbitrum", type: "crypto" },
  [PayoutNetwork.AVALANCHE]: { label: "Avalanche", type: "crypto" },
  [PayoutNetwork.TRON]: { label: "Tron", type: "crypto" },
};

// ACCOUNT TYPES
export type AccountType = "bank" | "crypto";
export type AccountOwnership = "self" | "recipient";
export type BankAccountType = "checking" | "savings" | "business";
export type AccountStatus = "active" | "pending" | "inactive";

export interface Account {
  id: string;

  // Display
  name: string; // "John Doe" or "Operations Wallet"
  nickname?: string; // Optional nickname i.e. "Main Trading"

  // Classification
  type: AccountType;
  ownership: AccountOwnership;

  // Bank-specific
  bankName?: string; // "Bank of America"
  bankLogo?: string; // URL to bank logo
  lastFour?: string; // "3848"
  routingNumber?: string; // "021000021"
  accountType?: BankAccountType;
  countryCode?: string; // For flag display

  // Address (for bank accounts)
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string; // ISO country code
  };

  // Crypto-specific
  network?: PayoutNetwork;
  walletAddress?: string;

  // Common
  currency: PayoutCurrency;

  // Metadata
  status: AccountStatus;
  createdAt: Date;
  lastUsedAt?: Date;

  // Optional flags
  isDefault?: boolean;
}

// Home Page types
export type HomeSummary = {
  monthlyTransferred: number;
  lastMonthTransferred: number;
};

export type HomeActivity = {
  id: string;
  to: string;
  amount: number;
  currency: PayoutCurrency;
  recipientAmount: number;
  recipientCurrency: PayoutCurrency;
  status: "completed" | "pending";
  sentAt: Date;
  type: "bank" | "crypto";
  bankName?: string;
  network?: PayoutNetwork;
};

export type UserProfile = {
  name: string;
  initials: string;
  organization: string;
  plan: string;
  email: string;
  kybStatus: "Verified" | "Pending" | "Unverified";
  kybVerifiedAt?: Date;
  customerId: string;
  phone: string;
};
