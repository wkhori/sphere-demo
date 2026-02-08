"use client";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-status-success text-status-success-foreground",
  Pending: "bg-status-warning text-status-warning-foreground",
  Inactive: "bg-status-neutral text-status-neutral-foreground",
  Error: "bg-status-error text-status-error-foreground",
  Info: "bg-status-info text-status-info-foreground",
};

const ROWS = [
  { name: "Alice Johnson", role: "Admin", status: "Active", amount: "$12,450" },
  { name: "Bob Chen", role: "Editor", status: "Pending", amount: "$8,200" },
  { name: "Carol Smith", role: "Viewer", status: "Inactive", amount: "$0" },
  { name: "Dave Williams", role: "Editor", status: "Error", amount: "$3,100" },
  { name: "Eve Davis", role: "Admin", status: "Info", amount: "$24,800" },
];

export function TablesSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Tables</h2>
        <p className="text-sm text-muted-foreground">
          Data table with status badges using semantic color tokens.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ROWS.map((row) => (
              <TableRow key={row.name}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="text-sm">{row.role}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                      STATUS_STYLES[row.status],
                    )}
                  >
                    {row.status}
                  </span>
                </TableCell>
                <TableCell className="text-right text-sm">{row.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
