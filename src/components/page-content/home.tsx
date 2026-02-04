"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { AnimatedNumber } from "@/components/motion-primitives/animated-number";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import {
  mockAccounts,
  mockHomeActivity,
  mockHomeSummary,
  mockUserProfile,
} from "@/lib/mock-data";
import { AssetIcon } from "@/components/ui/asset-icon";
import { ArrowUpRightIcon } from "@/components/ui/arrow-up-right";
import { CalendarDaysIcon } from "@/components/ui/calendar-days";
import { RefreshCWIcon } from "@/components/ui/refresh-cw";
import type { ArrowUpRightIconHandle } from "@/components/ui/arrow-up-right";
import type { CalendarDaysIconHandle } from "@/components/ui/calendar-days";
import type { RefreshCCWIconWIcon } from "@/components/ui/refresh-cw";
import { formatAmount, formatLastUsed } from "@/lib/utils";
import type { Account, HomeActivity } from "@/lib/types";

type RepeatPrefill = {
  from?: Account;
  to?: Account;
  amount: number;
};

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

const buildRepeatPrefill = (
  target: HomeActivity,
  selfAccounts: Account[],
  recipientAccounts: Account[],
  allAccounts: Account[],
): RepeatPrefill => {
  const matchingRecipient = findAccountByName(recipientAccounts, target.to);
  const matchingAny = findAccountByName(allAccounts, target.to);
  const from = pickFromAccount(selfAccounts, target.type, target.currency);
  const to =
    matchingRecipient ??
    matchingAny ??
    recipientAccounts.find((account) => account.type === target.type) ??
    undefined;

  return { from: from ?? undefined, to, amount: target.amount };
};

export function HomeContent({
  onNavigate,
  onRepeatLast,
}: {
  onNavigate: (view: "send" | "accounts") => void;
  onRepeatLast?: (prefill: {
    from?: Account;
    to?: Account;
    amount: number;
  }) => void;
}) {
  const selfAccounts = React.useMemo(
    () => mockAccounts.filter((account) => account.ownership === "self"),
    [],
  );
  const recipientAccounts = React.useMemo(
    () => mockAccounts.filter((account) => account.ownership === "recipient"),
    [],
  );
  const activeAccounts = mockAccounts.filter(
    (account) => account.status === "active",
  ).length;
  const recipientCount = recipientAccounts.length;
  const repeatTarget = mockHomeActivity[0];
  const repeatPrefill = React.useMemo(
    () =>
      repeatTarget
        ? buildRepeatPrefill(
            repeatTarget,
            selfAccounts,
            recipientAccounts,
            mockAccounts,
          )
        : null,
    [repeatTarget, selfAccounts, recipientAccounts],
  );
  const momDelta = mockHomeSummary.lastMonthTransferred
    ? ((mockHomeSummary.monthlyTransferred -
        mockHomeSummary.lastMonthTransferred) /
        mockHomeSummary.lastMonthTransferred) *
      100
    : 0;
  const momPositive = momDelta >= 0;
  const sendMoneyIconRef = React.useRef<ArrowUpRightIconHandle>(null);
  const sendCryptoIconRef = React.useRef<ArrowUpRightIconHandle>(null);
  const scheduleIconRef = React.useRef<CalendarDaysIconHandle>(null);
  const repeatIconRef = React.useRef<RefreshCCWIconWIcon>(null);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            <TextEffect preset="fade" per="word">
              {`Welcome back, ${mockUserProfile.name} 👋`}
            </TextEffect>
          </h1>
          <p className="text-muted-foreground">
            {mockUserProfile.organization} • {mockUserProfile.plan}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-3 md:items-center">
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                Transferred this month
              </p>
              <div className="text-3xl font-semibold">
                $<AnimatedNumber value={mockHomeSummary.monthlyTransferred} />
              </div>
              <p
                className={`
                  inline-flex items-center gap-1 text-xs font-medium
                  ${momPositive ? "text-emerald-600" : "text-rose-600"}
                `}
              >
                {momPositive ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                {Math.abs(momDelta).toFixed(1)}% vs last month
              </p>
            </div>
            <div className="space-y-2 md:border-l md:border-border/60 md:pl-6">
              <p className="text-muted-foreground text-sm">Active accounts</p>
              <p className="text-2xl font-semibold">{activeAccounts}</p>
              <p className="text-muted-foreground text-xs">
                Bank and crypto destinations
              </p>
            </div>
            <div className="space-y-2 md:border-l md:border-border/60 md:pl-6">
              <p className="text-muted-foreground text-sm">Recipients</p>
              <p className="text-2xl font-semibold">{recipientCount}</p>
              <p className="text-muted-foreground text-xs">
                Received money this year
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <p className="text-muted-foreground text-xs">
                Latest transfers across bank and crypto rails.
              </p>
            </div>
            <AnimatedGroup className="divide-y" preset="fade">
              {mockHomeActivity.map((tx) => {
                const currencyCode = tx.recipientCurrency.toUpperCase();
                const amount = formatAmount(
                  tx.recipientAmount,
                  tx.recipientCurrency,
                );
                const sentLabel = `Sent ${formatLastUsed(tx.sentAt)}`;

                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between px-6 py-4 transition hover:bg-muted/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                        <div className="absolute -bottom-1 -right-1">
                          {tx.type === "bank" ? (
                            <AssetIcon
                              type="bank"
                              bankName={tx.bankName ?? "Bank"}
                              size="sm"
                            />
                          ) : (
                            <AssetIcon
                              type="network"
                              network={tx.network!}
                              size="sm"
                            />
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">
                          {amount} → {tx.to}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {currencyCode} · {sentLabel}
                        </p>
                      </div>
                    </div>
                    {tx.status === "completed" ? (
                      <span className="text-green-600 text-sm flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                      </span>
                    ) : (
                      <span className="text-yellow-600 text-sm flex items-center gap-1">
                        <Loader2 className="h-3.5 w-3.5" /> Pending
                      </span>
                    )}
                  </div>
                );
              })}
            </AnimatedGroup>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Quick Actions</h2>
                <p className="text-muted-foreground text-xs">
                  Common transfer workflows.
                </p>
              </div>
            </div>
            <AnimatedGroup className="mt-4 space-y-3" preset="fade">
              <button
                type="button"
                onClick={() => onNavigate("send")}
                onMouseEnter={() => sendMoneyIconRef.current?.startAnimation()}
                onMouseLeave={() => sendMoneyIconRef.current?.stopAnimation()}
                className="flex w-full items-center justify-between rounded-lg border border-border/60 px-4 py-3 text-left transition hover:bg-muted/40"
              >
                <div>
                  <p className="font-medium">Send Money</p>
                  <p className="text-sm text-muted-foreground">
                    Transfer funds now
                  </p>
                </div>
                <ArrowUpRightIcon
                  ref={sendMoneyIconRef}
                  className="text-muted-foreground"
                  size={20}
                />
              </button>
              <button
                type="button"
                onClick={() => onNavigate("send")}
                onMouseEnter={() => sendCryptoIconRef.current?.startAnimation()}
                onMouseLeave={() => sendCryptoIconRef.current?.stopAnimation()}
                className="flex w-full items-center justify-between rounded-lg border border-border/60 px-4 py-3 text-left transition hover:bg-muted/40"
              >
                <div>
                  <p className="font-medium">Send Crypto</p>
                  <p className="text-sm text-muted-foreground">
                    USDC and USDT supported
                  </p>
                </div>
                <ArrowUpRightIcon
                  ref={sendCryptoIconRef}
                  className="text-muted-foreground"
                  size={20}
                />
              </button>
              <button
                type="button"
                onClick={() => onNavigate("send")}
                className="flex w-full items-center justify-between rounded-lg border border-border/60 px-4 py-3 text-left transition hover:bg-muted/40"
                onMouseEnter={() => scheduleIconRef.current?.startAnimation()}
                onMouseLeave={() => scheduleIconRef.current?.stopAnimation()}
              >
                <div>
                  <p className="font-medium">Schedule Payment</p>
                  <p className="text-sm text-muted-foreground">
                    Schedule a future or recurring transfer
                  </p>
                </div>
                <CalendarDaysIcon
                  ref={scheduleIconRef}
                  className="text-muted-foreground"
                  size={20}
                />
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-lg border border-border/60 px-4 py-3 text-left transition hover:bg-muted/40"
                onClick={() => {
                  if (repeatPrefill) {
                    onRepeatLast?.(repeatPrefill);
                  }
                }}
                onMouseEnter={() => repeatIconRef.current?.startAnimation()}
                onMouseLeave={() => repeatIconRef.current?.stopAnimation()}
              >
                <div>
                  <p className="font-medium">Repeat Last</p>
                  <p className="text-sm text-muted-foreground">
                    {repeatTarget
                      ? `${formatAmount(
                          repeatTarget.recipientAmount,
                          repeatTarget.recipientCurrency,
                        )} → ${repeatTarget.to}`
                      : "Repeat your latest transfer"}
                  </p>
                </div>
                <RefreshCWIcon
                  ref={repeatIconRef}
                  className="text-muted-foreground"
                  size={20}
                />
              </button>
            </AnimatedGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
