import type { Account } from "@/lib/types";

export type RepeatPrefill = {
  from?: Account;
  to?: Account;
  amount: number;
};
