"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { AnimatedNumber } from "@/components/motion-primitives/animated-number";
import {
  mockAccounts,
  mockHomeActivity,
  mockHomeSummary,
  mockUserProfile,
} from "@/lib/mock-data";
import { convertAmount } from "@/lib/send-money/amounts";
import type { Account, HomeActivity } from "@/lib/types";
import type { RepeatPrefill } from "./home-types";
import { RecentActivityCard } from "./home-recent-activity";
import { QuickActionsCard } from "./home-quick-actions";

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
        <RecentActivityCard activity={mockHomeActivity} />
        <QuickActionsCard
          onNavigate={onNavigate}
          onRepeatLast={onRepeatLast}
          repeatTarget={repeatTarget}
          repeatPrefill={repeatPrefill}
        />
      </div>
    </div>
  );
}
