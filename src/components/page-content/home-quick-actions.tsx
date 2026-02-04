"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import { ArrowUpRightIcon } from "@/components/ui/arrow-up-right";
import { CalendarDaysIcon } from "@/components/ui/calendar-days";
import { RefreshCWIcon } from "@/components/ui/refresh-cw";
import type { ArrowUpRightIconHandle } from "@/components/ui/arrow-up-right";
import type { CalendarDaysIconHandle } from "@/components/ui/calendar-days";
import type { RefreshCWIconHandle } from "@/components/ui/refresh-cw";
import { formatAmount } from "@/lib/utils";
import type { HomeActivity } from "@/lib/types";
import type { RepeatPrefill } from "./home-types";

type QuickActionsCardProps = {
  onNavigate: (view: "send" | "accounts") => void;
  onRepeatLast?: (prefill: RepeatPrefill) => void;
  repeatTarget?: HomeActivity;
  repeatPrefill: RepeatPrefill | null;
};

export function QuickActionsCard({
  onNavigate,
  onRepeatLast,
  repeatTarget,
  repeatPrefill,
}: QuickActionsCardProps) {
  const sendMoneyIconRef = React.useRef<ArrowUpRightIconHandle>(null);
  const sendCryptoIconRef = React.useRef<ArrowUpRightIconHandle>(null);
  const scheduleIconRef = React.useRef<CalendarDaysIconHandle>(null);
  const repeatIconRef = React.useRef<RefreshCWIconHandle>(null);

  return (
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
  );
}
