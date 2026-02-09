import type { Account } from "@/lib/types";

// Filter types and options — used by accounts index
export type FilterState = "all" | "self" | "recipient" | "bank" | "crypto";

export type FilterOption = {
  label: string;
  value: FilterState;
};

export const FILTERS: FilterOption[] = [
  { label: "All", value: "all" },
  { label: "My Accounts", value: "self" },
  { label: "Recipients", value: "recipient" },
  { label: "Bank", value: "bank" },
  { label: "Crypto", value: "crypto" },
];

// Account status display mappings — used by columns, detail sheet
export const STATUS_STYLES: Record<Account["status"], string> = {
  active: "bg-status-success text-status-success-foreground",
  pending: "bg-status-warning text-status-warning-foreground",
  inactive: "bg-status-neutral text-status-neutral-foreground",
};

export const STATUS_LABELS: Record<Account["status"], string> = {
  active: "Active",
  pending: "Pending",
  inactive: "Inactive",
};

// Fixed column widths — shared between paginated and virtualized views
export const COL_WIDTHS = ["30%", "10%", "18%", "10%", "14%", "8%"] as const;

// Table min width for horizontal scroll on mobile
export const TABLE_MIN_WIDTH = "700px";
