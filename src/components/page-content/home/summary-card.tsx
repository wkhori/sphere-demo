"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { AnimatedNumber } from "@/components/motion-primitives/animated-number";
import { mockAccounts, mockHomeSummary } from "@/lib/mock-data";

const activeAccounts = mockAccounts.filter(
  (account) => account.status === "active",
).length;

const recipientCount = mockAccounts.filter(
  (account) => account.ownership === "recipient",
).length;

const momDelta = mockHomeSummary.lastMonthTransferred
  ? ((mockHomeSummary.monthlyTransferred -
      mockHomeSummary.lastMonthTransferred) /
      mockHomeSummary.lastMonthTransferred) *
    100
  : 0;

const momPositive = momDelta >= 0;

export function SummaryCard() {
  return (
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
              className={`inline-flex items-center gap-1 text-xs font-medium ${momPositive ? "text-trend-positive" : "text-trend-negative"}`}
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
              <span className="text-muted-foreground ml-1">recipients</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
