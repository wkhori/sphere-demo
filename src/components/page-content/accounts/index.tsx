"use client";

import * as React from "react";
import { List, Plus, TableProperties } from "lucide-react";
import { Account } from "@/lib/types";
import { allMockAccounts } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { AccountsContext } from "./accounts-context";
import { AccountsPaginated } from "./accounts-paginated";
import { AccountsVirtualized } from "./accounts-virtualized";
import { AccountDetailSheet } from "./account-detail-sheet";
import { FILTERS, type FilterState } from "./shared";

type ViewMode = "paginated" | "virtualized";

export function AccountsView({
  onSelectAccount,
}: {
  onSelectAccount?: (account: Account) => void;
}) {
  const [viewMode, setViewMode] = React.useState<ViewMode>("paginated");
  const [filter, setFilter] = React.useState<FilterState>("all");
  const [detailAccount, setDetailAccount] = React.useState<Account | null>(
    null,
  );

  const filteredAccounts = React.useMemo(() => {
    if (filter === "all") return allMockAccounts;
    return allMockAccounts.filter((account) => {
      if (filter === "self" || filter === "recipient") {
        return account.ownership === filter;
      }
      return account.type === filter;
    });
  }, [filter]);

  return (
    <AccountsContext.Provider
      value={{
        onSelectAccount,
        onViewDetails: setDetailAccount,
      }}
    >
      <div className="bg-background/60 rounded-2xl border border-border/60 p-6 shadow-[0_1px_0_0_rgba(15,23,42,0.04)]">
        {/* Toolbar */}
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

          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="flex items-center rounded-lg border border-border/60 p-0.5">
              <Button
                variant={viewMode === "paginated" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("paginated")}
              >
                <TableProperties className="size-4" />
                Paginated
              </Button>
              <Button
                variant={viewMode === "virtualized" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("virtualized")}
              >
                <List className="size-4" />
                All ({filteredAccounts.length.toLocaleString()})
              </Button>
            </div>

            <Button size="sm" onClick={() => console.log("Add account")}>
              <Plus className="size-4" />
              Add Account
            </Button>
          </div>
        </div>

        {/* Table view */}
        <div className="mt-6">
          {viewMode === "paginated" ? (
            <AccountsPaginated data={filteredAccounts} />
          ) : (
            <AccountsVirtualized data={filteredAccounts} />
          )}
        </div>
      </div>

      <AccountDetailSheet
        account={detailAccount}
        onClose={() => setDetailAccount(null)}
        onSelectAccount={onSelectAccount}
      />
    </AccountsContext.Provider>
  );
}
