import {
  Account,
  PayoutCurrency,
  PayoutNetwork,
  BankAccountType,
  AccountStatus,
  AccountOwnership,
  AccountType,
} from "./types";


const FIRST_NAMES = [
  "James",
  "Maria",
  "Carlos",
  "Sofia",
  "Chen",
  "Aisha",
  "Raj",
  "Elena",
  "Marco",
  "Yuki",
  "Ahmed",
  "Anna",
  "Luis",
  "Fatima",
  "Wei",
  "Sarah",
  "Miguel",
  "Priya",
  "Ivan",
  "Amara",
  "Takeshi",
  "Nina",
  "Diego",
  "Lena",
  "Ali",
  "Rosa",
  "Kenji",
  "Olga",
  "Felipe",
  "Mei",
];

const LAST_NAMES = [
  "Smith",
  "Garcia",
  "Silva",
  "Wang",
  "Mueller",
  "Johnson",
  "Tanaka",
  "Patel",
  "Kim",
  "Santos",
  "Ivanov",
  "Lee",
  "Martinez",
  "Nakamura",
  "Ali",
  "Rodriguez",
  "Chen",
  "Petrov",
  "Nguyen",
  "Schmidt",
  "Park",
  "Costa",
  "Yamamoto",
  "Khan",
  "Lopez",
  "Sato",
  "Singh",
  "Brown",
  "Rossi",
  "Fernandez",
];

const COMPANY_NAMES = [
  "Global Payments",
  "TechFlow",
  "Nexus Corp",
  "Apex Trading",
  "Vertex Solutions",
  "Skyline Capital",
  "Momentum Partners",
  "Zenith Group",
  "Prism Digital",
  "Atlas Ventures",
  "Quantum Labs",
  "Sterling Finance",
  "Pacific Ventures",
  "Nordic Systems",
  "Summit Holdings",
  "Eclipse Inc",
  "Frontier Capital",
  "Cascade Group",
  "Meridian Tech",
  "Horizon Labs",
];

const NICKNAMES = [
  "Primary",
  "Operations",
  "Payroll",
  "Treasury",
  "Settlement",
  "Bridge Wallet",
  "Main Trading",
  "Revenue",
  "Supplier Payments",
  "Contractor Pay",
  "Client Fund",
  "Reserve",
  "Hot Wallet",
  "Cold Storage",
  "Disbursement",
  "Collection",
];

// Must match BANK_LOGOS keys in icons.ts
const BANK_NAMES = [
  "Bank of America",
  "Barclays",
  "BBVA Mexico",
  "Chase",
  "Citi",
  "Itau Unibanco",
  "PNC",
  "TD Bank",
  "Wells Fargo",
];

// Crypto networks that have icons in CRYPTO_ICONS
const CRYPTO_NETWORKS = [
  PayoutNetwork.SOL,
  PayoutNetwork.ETH,
  PayoutNetwork.POLYGON,
  PayoutNetwork.BASE,
  PayoutNetwork.ARBITRUM,
  PayoutNetwork.AVALANCHE,
  PayoutNetwork.TRON,
];

const FIAT_CURRENCIES = [
  PayoutCurrency.USD,
  PayoutCurrency.EUR,
  PayoutCurrency.BRL,
  PayoutCurrency.CAD,
  PayoutCurrency.MXN,
  PayoutCurrency.GBP,
  PayoutCurrency.SGD,
  PayoutCurrency.INR,
  PayoutCurrency.PHP,
];

const COUNTRY_CODES = [
  "us",
  "gb",
  "br",
  "ca",
  "mx",
  "de",
  "sg",
  "in",
  "ph",
  "jp",
  "kr",
  "au",
];

const BANK_ACCOUNT_TYPES: BankAccountType[] = [
  "checking",
  "savings",
  "business",
];

function generateWalletAddress(
  rand: () => number,
  network: PayoutNetwork,
): string {
  if (network === PayoutNetwork.SOL) {
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    let addr = "";
    for (let i = 0; i < 44; i++) {
      addr += chars[Math.floor(rand() * chars.length)];
    }
    return addr;
  }
  // EVM-style address
  const hexChars = "0123456789abcdef";
  let addr = "0x";
  for (let i = 0; i < 40; i++) {
    addr += hexChars[Math.floor(rand() * hexChars.length)];
  }
  return addr;
}

export function generateMockAccounts(count: number): Account[] {
  const rand = Math.random;
  const accounts: Account[] = [];

  for (let i = 0; i < count; i++) {
    const id = `acc_gen_${String(i + 1).padStart(4, "0")}`;
    const isBankAccount = rand() < 0.55;
    const type: AccountType = isBankAccount ? "bank" : "crypto";
    const ownership: AccountOwnership = rand() < 0.6 ? "self" : "recipient";

    const statusRoll = rand();
    const status: AccountStatus =
      statusRoll < 0.7 ? "active" : statusRoll < 0.85 ? "pending" : "inactive";

    const isCompany = rand() < 0.35;
    const firstName = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    const companyName =
      COMPANY_NAMES[Math.floor(rand() * COMPANY_NAMES.length)];
    const name = isCompany ? companyName : `${firstName} ${lastName}`;

    const hasNickname = rand() < 0.3;
    const nickname = hasNickname
      ? NICKNAMES[Math.floor(rand() * NICKNAMES.length)]
      : undefined;

    const createdAt = new Date(
      2023 + Math.floor(rand() * 3),
      Math.floor(rand() * 12),
      1 + Math.floor(rand() * 28),
    );

    const hasLastUsed = status !== "pending" || rand() < 0.3;
    const lastUsedAt = hasLastUsed
      ? new Date(
          Math.max(
            createdAt.getTime(),
            Date.now() - Math.floor(rand() * 365 * 24 * 60 * 60 * 1000),
          ),
        )
      : undefined;

    if (isBankAccount) {
      const bankName = BANK_NAMES[Math.floor(rand() * BANK_NAMES.length)];
      const lastFour = String(Math.floor(rand() * 10000)).padStart(4, "0");
      const accountType =
        BANK_ACCOUNT_TYPES[Math.floor(rand() * BANK_ACCOUNT_TYPES.length)];
      const currency =
        FIAT_CURRENCIES[Math.floor(rand() * FIAT_CURRENCIES.length)];
      const countryCode =
        COUNTRY_CODES[Math.floor(rand() * COUNTRY_CODES.length)];

      accounts.push({
        id,
        name,
        nickname,
        type,
        ownership,
        bankName,
        lastFour,
        accountType,
        currency,
        countryCode,
        status,
        createdAt,
        lastUsedAt,
        isDefault: false,
      });
    } else {
      const network =
        CRYPTO_NETWORKS[Math.floor(rand() * CRYPTO_NETWORKS.length)];
      const currency = rand() < 0.7 ? PayoutCurrency.USDC : PayoutCurrency.USDT;
      const walletAddress = generateWalletAddress(rand, network);

      accounts.push({
        id,
        name,
        nickname,
        type,
        ownership,
        network,
        walletAddress,
        currency,
        status,
        createdAt,
        lastUsedAt,
        isDefault: false,
      });
    }
  }

  return accounts;
}
