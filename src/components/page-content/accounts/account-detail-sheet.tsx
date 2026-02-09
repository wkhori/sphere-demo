"use client";

import { ArrowUpRightIcon, Building2, Wallet } from "lucide-react";
import { Account, NETWORK_META } from "@/lib/types";
import { cn, formatAccountIdentifier, formatLastUsed } from "@/lib/utils";
import { AssetIcon } from "@/components/ui/asset-icon";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { STATUS_STYLES, STATUS_LABELS } from "./shared";

function DetailContent({
  account,
  onSelectAccount,
  onClose,
}: {
  account: Account;
  onSelectAccount?: (account: Account) => void;
  onClose: () => void;
}) {
  const networkLabel =
    account.type === "bank"
      ? account.bankName
      : account.network
        ? NETWORK_META[account.network].label
        : "—";

  return (
    <>
      <SheetHeader>
        <SheetTitle>{account.nickname ?? account.name}</SheetTitle>
        <SheetDescription>
          {account.type === "bank" ? "Bank account" : "Crypto wallet"} details
        </SheetDescription>
      </SheetHeader>
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-3">
          {account.type === "bank" ? (
            <AssetIcon
              type="bank"
              bankName={account.bankName ?? "Bank"}
              size="lg"
            />
          ) : (
            <AssetIcon type="network" network={account.network!} size="lg" />
          )}
          <div>
            <p className="font-medium">{account.nickname ?? account.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatAccountIdentifier(account)}
            </p>
          </div>
        </div>
        <div className="space-y-3 rounded-lg border border-border/40 p-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span
              className={cn(
                "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                STATUS_STYLES[account.status],
              )}
            >
              {STATUS_LABELS[account.status]}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Type</span>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                account.type === "bank"
                  ? "bg-status-neutral text-status-neutral-foreground"
                  : "bg-status-info text-status-info-foreground",
              )}
            >
              {account.type === "bank" ? (
                <Building2 className="size-3.5" />
              ) : (
                <Wallet className="size-3.5" />
              )}
              {account.type === "bank" ? "Bank" : "Crypto"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Network</span>
            <span>{networkLabel}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Currency</span>
            <span className="uppercase">{account.currency}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last Used</span>
            <span>{formatLastUsed(account.lastUsedAt)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Ownership</span>
            <span className="capitalize">{account.ownership}</span>
          </div>
        </div>
        <Button
          className="w-full"
          size="sm"
          onClick={() => {
            onSelectAccount?.(account);
            onClose();
          }}
        >
          <ArrowUpRightIcon className="size-4" />
          Send Money
        </Button>
      </div>
    </>
  );
}

export function AccountDetailSheet({
  account,
  onClose,
  onSelectAccount,
}: {
  account: Account | null;
  onClose: () => void;
  onSelectAccount?: (account: Account) => void;
}) {
  const isMobile = useIsMobile();

  return (
    <Sheet
      open={!!account}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={cn(isMobile && "max-h-[85vh] overflow-y-auto rounded-t-2xl")}
      >
        {account && (
          <DetailContent
            account={account}
            onSelectAccount={onSelectAccount}
            onClose={onClose}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
