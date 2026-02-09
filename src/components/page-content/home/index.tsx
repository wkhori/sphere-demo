"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, X, TrendingDown, TrendingUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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
import type { RepeatPrefill } from "./types";
import { RecentActivityCard } from "./recent-activity";
import { QuickActionsCard } from "./quick-actions";

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

const BANNER_DISMISSED_KEY = "theme-banner-dismissed";

export function HomeContent({
  onNavigate,
  onRepeatLast,
  onThemeSettings,
}: {
  onNavigate: (view: "send" | "accounts") => void;
  onRepeatLast?: (prefill: {
    from?: Account;
    to?: Account;
    amount: number;
  }) => void;
  onThemeSettings?: () => void;
}) {
  const [bannerDismissed, setBannerDismissed] = React.useState(true);

  React.useEffect(() => {
    setBannerDismissed(
      localStorage.getItem(BANNER_DISMISSED_KEY) === "true",
    );
  }, []);

  const dismissBanner = () => {
    setBannerDismissed(true);
    localStorage.setItem(BANNER_DISMISSED_KEY, "true");
  };
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
      <AnimatePresence>
        {!bannerDismissed && onThemeSettings && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex items-center gap-4 rounded-lg border border-primary/25 bg-linear-to-r from-primary/8 via-primary/4 to-transparent px-4 py-3">
              <motion.div
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="size-4 text-primary" />
              </motion.div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="relative overflow-hidden rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                    New
                    <span className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_ease-in-out_infinite] bg-linear-to-r from-transparent via-white/25 to-transparent" />
                  </span>
                  <p className="text-sm font-medium">
                    Theme customization is here
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Match the dashboard look and feel to your brand.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  dismissBanner();
                  onThemeSettings();
                }}
              >
                Explore
                <ArrowRight className="size-3.5" />
              </Button>
              <button
                type="button"
                onClick={dismissBanner}
                className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <div className="text-3xl font-semibold text-primary">
                $<AnimatedNumber value={mockHomeSummary.monthlyTransferred} />
              </div>
              <p
                className={`
                  inline-flex items-center gap-1 text-xs font-medium
                  ${momPositive ? "text-trend-positive" : "text-trend-negative"}
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
              <p className="text-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-status-success px-1.5 py-0.5 text-status-success-foreground font-medium">
                  {activeAccounts} active
                </span>
                <span className="text-muted-foreground ml-1">
                  of {mockAccounts.length} total
                </span>
              </p>
            </div>
            <div className="space-y-2 md:border-l md:border-border/60 md:pl-6">
              <p className="text-muted-foreground text-sm">Recipients</p>
              <p className="text-2xl font-semibold">{recipientCount}</p>
              <p className="text-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-status-info px-1.5 py-0.5 text-status-info-foreground font-medium">
                  {recipientCount} saved
                </span>
                <span className="text-muted-foreground ml-1">
                  recipients
                </span>
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
