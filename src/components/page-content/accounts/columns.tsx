"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  ArrowUpRightIcon,
  Building2,
  Eye,
  MoreHorizontal,
  Star,
  Trash2,
  Wallet,
} from "lucide-react";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAccountsContext } from "./accounts-context";
import { STATUS_STYLES, STATUS_LABELS } from "./shared";

function AccountCell({ account }: { account: Account }) {
  const identifier = formatAccountIdentifier(account);
  return (
    <div className="flex items-center gap-3">
      {account.type === "bank" ? (
        <AssetIcon type="bank" bankName={account.bankName ?? "Bank"} />
      ) : (
        <AssetIcon type="network" network={account.network!} />
      )}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">
            {account.nickname ?? account.name}
          </span>
          {account.isDefault ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Star className="size-4 fill-star text-star" />
              </TooltipTrigger>
              <TooltipContent>Default account</TooltipContent>
            </Tooltip>
          ) : null}
          {account.ownership === "recipient" ? (
            <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium">
              Recipient
            </span>
          ) : null}
        </div>
        <p className="text-muted-foreground text-xs">{identifier}</p>
      </div>
    </div>
  );
}

function TypeBadge({ type }: { type: Account["type"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        type === "bank"
          ? "bg-status-neutral text-status-neutral-foreground"
          : "bg-status-info text-status-info-foreground",
      )}
    >
      {type === "bank" ? (
        <Building2 className="size-3.5" />
      ) : (
        <Wallet className="size-3.5" />
      )}
      {type === "bank" ? "Bank" : "Crypto"}
    </span>
  );
}

function StatusBadge({ status }: { status: Account["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function ActionsCell({ account }: { account: Account }) {
  const { onSelectAccount, onViewDetails } = useAccountsContext();
  return (
    <div className="flex items-center justify-end gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onSelectAccount?.(account);
            }}
          >
            <ArrowUpRightIcon className="size-4" />
            Send Money
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(account);
            }}
          >
            <Eye className="size-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Remove", account.id);
            }}
          >
            <Trash2 className="size-4" />
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function SortableHeader({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button variant="ghost" size="sm" className="-ml-3" onClick={onClick}>
      {label}
      <ArrowUpDown className="ml-1 size-3.5" />
    </Button>
  );
}

export const columns: ColumnDef<Account>[] = [
  {
    id: "account",
    accessorFn: (row) => row.nickname ?? row.name,
    header: ({ column }) => (
      <SortableHeader
        label="Account"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => <AccountCell account={row.original} />,
  },
  {
    id: "type",
    accessorKey: "type",
    header: ({ column }) => (
      <SortableHeader
        label="Type"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => <TypeBadge type={row.original.type} />,
  },
  {
    id: "networkBank",
    accessorFn: (row) =>
      row.type === "bank"
        ? row.bankName
        : row.network
          ? NETWORK_META[row.network].label
          : "—",
    header: ({ column }) => (
      <SortableHeader
        label="Network/Bank"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ getValue }) => (
      <span className="text-sm">{getValue() as string}</span>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => (
      <SortableHeader
        label="Status"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "lastUsed",
    accessorKey: "lastUsedAt",
    header: ({ column }) => (
      <SortableHeader
        label="Last Used"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <span className="text-sm">{formatLastUsed(row.original.lastUsedAt)}</span>
    ),
    sortingFn: "datetime",
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <ActionsCell account={row.original} />,
    enableSorting: false,
  },
];
