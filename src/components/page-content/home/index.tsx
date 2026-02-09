"use client";

import * as React from "react";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import {
  mockAccounts,
  mockHomeActivity,
  mockUserProfile,
} from "@/lib/mock-data";
import type { Account } from "@/lib/types";
import { buildRepeatPrefill } from "./repeat-prefill";
import { RecentActivityCard } from "./recent-activity";
import { QuickActionsCard } from "./quick-actions";
import { SummaryCard } from "./summary-card";
import { ThemeBanner, useThemeBanner } from "./theme-banner";

const selfAccounts = mockAccounts.filter(
  (account) => account.ownership === "self",
);
const recipientAccounts = mockAccounts.filter(
  (account) => account.ownership === "recipient",
);

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
  const { bannerDismissed, dismissBanner } = useThemeBanner();

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
    [repeatTarget],
  );

  return (
    <div className="space-y-10">
      {onThemeSettings && (
        <ThemeBanner
          dismissed={bannerDismissed}
          onDismiss={dismissBanner}
          onExplore={onThemeSettings}
        />
      )}

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

      <SummaryCard />

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
