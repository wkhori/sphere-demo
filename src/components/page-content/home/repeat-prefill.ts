import { convertAmount } from "@/lib/send-money/amounts";
import type { Account, HomeActivity } from "@/lib/types";
import type { RepeatPrefill } from "./types";

const findAccountByName = (accounts: Account[], target: string) =>
  accounts.find(
    (account) => account.name === target || account.nickname === target,
  );

const pickFromAccount = (
  accounts: Account[],
  type: Account["type"],
  currency: Account["currency"],
) =>
  accounts.find(
    (account) => account.type === type && account.currency === currency,
  ) ??
  accounts.find((account) => account.type === type && account.isDefault) ??
  accounts.find((account) => account.type === type) ??
  null;

export function buildRepeatPrefill(
  target: HomeActivity,
  selfAccounts: Account[],
  recipientAccounts: Account[],
  allAccounts: Account[],
): RepeatPrefill {
  const matchingRecipient = findAccountByName(recipientAccounts, target.to);
  const matchingAny = findAccountByName(allAccounts, target.to);
  const from = pickFromAccount(selfAccounts, target.type, target.currency);
  const to =
    matchingRecipient ??
    matchingAny ??
    recipientAccounts.find((account) => account.type === target.type) ??
    undefined;

  const fromCurrency = from?.currency ?? target.currency;
  const amount =
    fromCurrency === target.currency
      ? target.amount
      : Number(
          convertAmount(target.amount, target.currency, fromCurrency).toFixed(
            2,
          ),
        );

  return { from: from ?? undefined, to, amount };
}
