import { PayoutCurrency, PayoutNetwork } from "./types";

// BANK LOGOS (local assets in /public/banks/)
export const BANK_LOGOS: Record<string, string> = {
  "Bank of America": "/banks/bank-of-america.svg",
  Barclays: "/banks/barclays.png",
  "BBVA Mexico": "/banks/bbva-mx.png",
  Chase: "/banks/chase.svg",
  Citi: "/banks/citi.svg",
  "Itau Unibanco": "/banks/itau.svg",
  PNC: "/banks/pnc.svg",
  "TD Bank": "/banks/td.png",
  "Wells Fargo": "/banks/wells-fargo.svg",
};

// CRYPTO ICONS (currencies + networks - external URLs)
export const CRYPTO_ICONS: Partial<
  Record<PayoutCurrency | PayoutNetwork, string>
> = {
  // Stablecoins
  [PayoutCurrency.USDC]:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
  [PayoutCurrency.USDT]:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",

  // Networks
  [PayoutNetwork.SOL]:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png",
  [PayoutNetwork.ETH]:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
  [PayoutNetwork.POLYGON]:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
  [PayoutNetwork.BASE]:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png",
  [PayoutNetwork.ARBITRUM]:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png",
  [PayoutNetwork.TRON]:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/tron/info/logo.png",
  [PayoutNetwork.AVALANCHE]:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png",
};

// Get icon helpers
export function getBankLogo(bankName: string): string | undefined {
  return BANK_LOGOS[bankName];
}

export function getCryptoIcon(
  asset: PayoutCurrency | PayoutNetwork,
): string | undefined {
  return CRYPTO_ICONS[asset];
}
