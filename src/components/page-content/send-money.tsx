"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockAccounts } from "@/lib/mock-data";
import { PayoutCurrency } from "@/lib/types";
import type { Account } from "@/lib/types";
import {
  formatCurrencyValue,
  parseAmountInput,
} from "@/lib/send-money/amounts";

import { AccountSelectCard } from "./send-money/account-select-card";
import { RoutesSection } from "./send-money/routes-section";
import { useSendMoneyRoutes } from "@/hooks/use-send-money-routes";

interface SendMoneyProps {
  prefill?: { from?: Account; to?: Account; amount?: number };
  onNavigate: (view: "home" | "accounts") => void;
}

const CRYPTO_CURRENCIES: PayoutCurrency[] = [
  PayoutCurrency.USDC,
  PayoutCurrency.USDT,
];

const getInitialCryptoCurrency = (account?: Account) =>
  account?.type === "crypto" ? account.currency : PayoutCurrency.USDC;

export function SendMoney({ prefill, onNavigate }: SendMoneyProps) {
  const [fromAccount, setFromAccount] = React.useState<Account | null>(
    prefill?.from ?? null,
  );
  const [toAccount, setToAccount] = React.useState<Account | null>(
    prefill?.to ?? null,
  );
  const [amountInput, setAmountInput] = React.useState<string>(
    prefill?.amount !== undefined ? String(prefill.amount) : "",
  );
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [fromCryptoCurrency, setFromCryptoCurrency] =
    React.useState<PayoutCurrency>(() =>
      getInitialCryptoCurrency(prefill?.from),
    );
  const [toCryptoCurrency, setToCryptoCurrency] =
    React.useState<PayoutCurrency>(() => getInitialCryptoCurrency(prefill?.to));

  const resetForm = React.useCallback(() => {
    setFromAccount(null);
    setToAccount(null);
    setAmountInput("");
    setFromCryptoCurrency(PayoutCurrency.USDC);
    setToCryptoCurrency(PayoutCurrency.USDC);
  }, []);

  const selfAccounts = React.useMemo(
    () => mockAccounts.filter((account) => account.ownership === "self"),
    [],
  );
  const recipientAccounts = React.useMemo(
    () => mockAccounts.filter((account) => account.ownership === "recipient"),
    [],
  );

  React.useEffect(() => {
    setFromAccount(prefill?.from ?? null);
    setToAccount(prefill?.to ?? null);
    setAmountInput(prefill?.amount !== undefined ? String(prefill.amount) : "");
  }, [prefill?.from, prefill?.to, prefill?.amount]);

  React.useEffect(() => {
    if (fromAccount?.type !== "crypto") return;
    const preferred = CRYPTO_CURRENCIES.includes(fromAccount.currency)
      ? fromAccount.currency
      : PayoutCurrency.USDC;
    setFromCryptoCurrency(preferred);
  }, [fromAccount?.id, fromAccount?.type, fromAccount?.currency]);

  React.useEffect(() => {
    if (toAccount?.type !== "crypto") return;
    const preferred = CRYPTO_CURRENCIES.includes(toAccount.currency)
      ? toAccount.currency
      : PayoutCurrency.USDC;
    setToCryptoCurrency(preferred);
  }, [toAccount?.id, toAccount?.type, toAccount?.currency]);

  const fromCurrency =
    fromAccount?.type === "crypto" ? fromCryptoCurrency : fromAccount?.currency;
  const toCurrency =
    toAccount?.type === "crypto" ? toCryptoCurrency : toAccount?.currency;

  const {
    displayedRoutes,
    selectedRouteId,
    setSelectedRouteId,
    lockedRoutes,
    rateDirection,
    now,
    handleRefreshRoutes,
    handleLockRoute,
    effectiveRate,
  } = useSendMoneyRoutes({ fromCurrency, toCurrency });

  const amount = parseAmountInput(amountInput);
  const convertedAmount =
    effectiveRate && toCurrency
      ? formatCurrencyValue(amount * effectiveRate, toCurrency)
      : "—";

  if (showConfirmation) {
    return (
      <div className="space-y-4 mx-auto w-full max-w-129 md:w-129">
        <div className="rounded-lg bg-muted/15 p-4 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold">Transfer queued</h2>
          <p className="text-sm text-muted-foreground">
            We’ll notify you when the transfer completes.
          </p>
        </div>
        <Button className="w-full" onClick={() => onNavigate("home")}>
          Back to Home
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => {
            resetForm();
            setShowConfirmation(false);
          }}
        >
          Send another transfer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 mx-auto w-full max-w-129 md:w-129">
      <div className="space-y-2">
        <AccountSelectCard
          label="FROM"
          value={fromAccount}
          onChange={setFromAccount}
          placeholder="Select account"
          groups={[{ label: "Your Accounts", accounts: selfAccounts }]}
          currency={fromCurrency}
          onCurrencyChange={setFromCryptoCurrency}
          cryptoCurrencies={CRYPTO_CURRENCIES}
        />

        <div className="flex items-center justify-center">
          <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
        </div>

        <AccountSelectCard
          label="TO"
          value={toAccount}
          onChange={setToAccount}
          placeholder="Select recipient"
          groups={[
            { label: "Your Accounts", accounts: selfAccounts },
            { label: "Recipients", accounts: recipientAccounts },
          ]}
          currency={toCurrency}
          onCurrencyChange={setToCryptoCurrency}
          cryptoCurrencies={CRYPTO_CURRENCIES}
        />
      </div>

      <Card className="border-0 bg-transparent shadow-none py-0 gap-0">
        <CardContent className="p-0">
          <div className="p-2">
            <p className="text-muted-foreground text-xs">AMOUNT</p>
            <div className="mt-2 flex items-center gap-3">
              <input
                value={amountInput}
                onChange={(event) => setAmountInput(event.target.value)}
                placeholder="0.00"
                className="bg-background border-border/40 text-foreground w-full rounded-md border px-3 py-2 text-xl font-semibold outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              Recipient receives ≈ {convertedAmount}
            </p>
          </div>
        </CardContent>
      </Card>

      <RoutesSection
        amount={amount}
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        displayedRoutes={displayedRoutes}
        selectedRouteId={selectedRouteId}
        lockedRoutes={lockedRoutes}
        rateDirection={rateDirection}
        now={now}
        onSelectRoute={(routeId) => setSelectedRouteId(routeId)}
        onRefreshRoutes={handleRefreshRoutes}
        onLockRoute={handleLockRoute}
      />

      <Button
        className="w-full"
        disabled={!selectedRouteId}
        onClick={() => setShowConfirmation(true)}
      >
        Continue
      </Button>
    </div>
  );
}
