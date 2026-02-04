"use client";

import * as React from "react";

import { AssetIcon } from "@/components/ui/asset-icon";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  CURRENCY_META,
  NETWORK_META,
  PayoutCurrency,
  PayoutNetwork,
} from "@/lib/types";
import type { Account } from "@/lib/types";

type AccountGroup = {
  label: string;
  accounts: Account[];
};

type AccountSelectCardProps = {
  label: string;
  value: Account | null;
  onChange: (account: Account | null) => void;
  groups: AccountGroup[];
  placeholder?: string;
  currency?: PayoutCurrency;
  onCurrencyChange?: (currency: PayoutCurrency) => void;
  cryptoCurrencies: PayoutCurrency[];
};

const AccountOption = ({
  account,
  compact = false,
}: {
  account: Account;
  compact?: boolean;
}) => {
  const subtitle =
    account.type === "bank"
      ? `${account.bankName ?? "Bank"}`
      : account.network
        ? NETWORK_META[account.network as PayoutNetwork].label
        : "Crypto";

  return (
    <div className="flex items-center gap-3 text-left">
      {account.type === "bank" ? (
        <AssetIcon type="bank" bankName={account.bankName ?? "Bank"} />
      ) : (
        <AssetIcon type="network" network={account.network as PayoutNetwork} />
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium leading-none">
          {account.nickname ?? account.name}
        </p>
        {compact ? null : (
          <p className="text-xs text-muted-foreground leading-none">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

const CurrencyOption = ({ currency }: { currency: PayoutCurrency }) => (
  <div className="flex min-w-0 items-center gap-2">
    <AssetIcon type="currency" currency={currency} size="sm" />
    <span className="truncate text-sm font-medium">
      {currency.toUpperCase()}
    </span>
  </div>
);

export function AccountSelectCard({
  label,
  value,
  onChange,
  groups,
  placeholder = "Select account",
  currency,
  onCurrencyChange,
  cryptoCurrencies,
}: AccountSelectCardProps) {
  const isCrypto = value?.type === "crypto";
  const currencyMeta =
    value?.type === "bank" ? CURRENCY_META[value.currency] : null;

  return (
    <Card className="flex-1 w-full border-0 bg-transparent shadow-none py-0 gap-0">
      <CardContent className="p-0">
        <div className="flex h-full flex-col p-2">
        <p className="text-muted-foreground text-xs">{label}</p>
        <div className="mt-2 grid gap-2 grid-cols-[minmax(0,3fr)_minmax(0,1fr)] items-start">
          <div className="min-w-0">
            <Select
              value={value?.id ?? ""}
              onValueChange={(selected) => {
                const next = groups
                  .flatMap((group) => group.accounts)
                  .find((account) => account.id === selected);
                onChange(next ?? null);
              }}
            >
              <SelectTrigger className="h-10 w-full py-0 cursor-pointer text-left border-border/40 min-w-0">
                {value ? (
                  <AccountOption account={value} compact />
                ) : (
                  <span className="text-muted-foreground text-sm block w-full">
                    {placeholder}
                  </span>
                )}
              </SelectTrigger>
              <SelectContent>
                {groups.map((group, index) => (
                  <React.Fragment key={group.label}>
                    {index > 0 ? <Separator className="my-2" /> : null}
                    <SelectGroup>
                      <SelectLabel>{group.label}</SelectLabel>
                      {group.accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          <AccountOption account={account} />
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </React.Fragment>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-0 min-w-0">
            {!value ? (
              <div className="h-10 w-full rounded-md bg-muted/20" />
            ) : isCrypto ? (
              <Select
                value={currency ?? ""}
                onValueChange={(next) =>
                  onCurrencyChange?.(next as PayoutCurrency)
                }
              >
                <SelectTrigger className="h-10 w-full border-border/40 min-w-0">
                  {currency ? (
                    <CurrencyOption currency={currency} />
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Currency
                    </span>
                  )}
                </SelectTrigger>
                <SelectContent>
                  {cryptoCurrencies.map((crypto) => (
                    <SelectItem key={crypto} value={crypto}>
                      <CurrencyOption currency={crypto} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex h-10 items-center gap-3 rounded-md bg-muted/20 px-3 py-2">
                <AssetIcon type="currency" currency={value.currency} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {currencyMeta?.label ?? value.currency.toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {value.currency.toUpperCase()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
