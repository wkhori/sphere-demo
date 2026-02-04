"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import { AssetIcon } from "@/components/ui/asset-icon";
import { formatAmount, formatLastUsed } from "@/lib/utils";
import type { HomeActivity } from "@/lib/types";

type RecentActivityCardProps = {
  activity: HomeActivity[];
};

export function RecentActivityCard({ activity }: RecentActivityCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <p className="text-muted-foreground text-xs">
            Latest transfers across bank and crypto rails.
          </p>
        </div>
        <AnimatedGroup className="divide-y" preset="fade">
          {activity.map((tx) => {
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
  );
}
