"use client";

import * as React from "react";
import {
  ArrowUpRightIcon,
  Building2,
  Eye,
  MoreHorizontal,
  Plus,
  Star,
  Trash2,
  Wallet,
} from "lucide-react";
import { mockAccounts } from "@/lib/mock-data";
import { Account, NETWORK_META } from "@/lib/types";
import { cn, formatAccountIdentifier, formatLastUsed } from "@/lib/utils";
import { AssetIcon } from "@/components/ui/asset-icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type FilterState = "all" | "self" | "recipient" | "bank" | "crypto";

type FilterOption = {
  label: string;
  value: FilterState;
};

const FILTERS: FilterOption[] = [
  { label: "All", value: "all" },
  { label: "My Accounts", value: "self" },
  { label: "Recipients", value: "recipient" },
  { label: "Bank", value: "bank" },
  { label: "Crypto", value: "crypto" },
];

const STATUS_STYLES: Record<Account["status"], string> = {
  active: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  inactive: "bg-slate-100 text-slate-700",
};

const STATUS_LABELS: Record<Account["status"], string> = {
  active: "Active",
  pending: "Pending",
  inactive: "Inactive",
};

export function AccountsTable({
  onSelectAccount,
}: {
  onSelectAccount?: (account: Account) => void;
}) {
  const [filter, setFilter] = React.useState<FilterState>("all");

  const filteredAccounts = React.useMemo(() => {
    return mockAccounts.filter((account) => {
      if (filter === "self") return account.ownership === "self";
      if (filter === "recipient") return account.ownership === "recipient";
      if (filter === "bank") return account.type === "bank";
      if (filter === "crypto") return account.type === "crypto";
      return true;
    });
  }, [filter]);

  return (
    <div className="bg-background/60 rounded-2xl border border-border/60 p-6 shadow-[0_1px_0_0_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((option) => (
            <Button
              key={option.value}
              variant={filter === option.value ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <Button size="sm" onClick={() => console.log("Add account")}>
          <Plus className="size-4" />
          Add Account
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Network/Bank</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccounts.map((account) => {
              const identifier = formatAccountIdentifier(account);
              const networkLabel =
                account.type === "bank"
                  ? account.bankName
                  : account.network
                    ? NETWORK_META[account.network].label
                    : "—";

              return (
                <TableRow
                  key={account.id}
                  className={cn(
                    onSelectAccount ? "cursor-pointer" : "cursor-default",
                  )}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {account.type === "bank" ? (
                        <AssetIcon
                          type="bank"
                          bankName={account.bankName ?? "Bank"}
                        />
                      ) : (
                        <AssetIcon type="network" network={account.network!} />
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium">
                            {account.nickname ?? account.name}
                          </span>
                          {account.isDefault ? (
                            <Star className="size-4 fill-amber-400 text-amber-400" />
                          ) : null}
                          {account.ownership === "recipient" ? (
                            <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                              Recipient
                            </span>
                          ) : null}
                        </div>
                        <p className="text-muted-foreground text-xs">
                          {identifier}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                        account.type === "bank"
                          ? "bg-slate-100 text-slate-700"
                          : "bg-indigo-100 text-indigo-700",
                      )}
                    >
                      {account.type === "bank" ? (
                        <Building2 className="size-3.5" />
                      ) : (
                        <Wallet className="size-3.5" />
                      )}
                      {account.type === "bank" ? "Bank" : "Crypto"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{networkLabel}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                        STATUS_STYLES[account.status],
                      )}
                    >
                      {STATUS_LABELS[account.status]}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatLastUsed(account.lastUsedAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(event) => {
                              event.stopPropagation();
                              onSelectAccount?.(account);
                            }}
                          >
                            <ArrowUpRightIcon className="size-4" />
                            Send Money
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(event) => {
                              event.stopPropagation();
                              console.log("View details", account.id);
                            }}
                          >
                            <Eye className="size-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={(event) => {
                              event.stopPropagation();
                              console.log("Remove", account.id);
                            }}
                          >
                            <Trash2 className="size-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <p className="text-muted-foreground mt-4 text-xs">
        Showing {filteredAccounts.length} of {mockAccounts.length} accounts
      </p>
    </div>
  );
}
