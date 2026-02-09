"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Account } from "@/lib/types";
import { useAccountsContext } from "./accounts-context";
import { columns } from "./columns";
import { COL_WIDTHS, TABLE_MIN_WIDTH } from "./shared";

const ROW_HEIGHT = 53;
const OVERSCAN = 15;

export function AccountsVirtualized({ data }: { data: Account[] }) {
  "use no memo";
  const { onViewDetails } = useAccountsContext();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  const { rows } = table.getRowModel();

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
  });

  // Reset scroll when data changes (e.g. filter change)
  React.useEffect(() => {
    virtualizer.scrollToIndex(0);
  }, [data, virtualizer]);

  const virtualItems = virtualizer.getVirtualItems();

  const rowStyle: React.CSSProperties = {
    display: "table",
    tableLayout: "fixed",
    width: "100%",
    minWidth: TABLE_MIN_WIDTH,
  };

  return (
    <div>
      <div className="rounded-xl border border-border/60 overflow-hidden">
        {/* Fixed header — outside scroll container */}
        <div className="bg-primary/5 overflow-hidden" role="rowgroup">
          {table.getHeaderGroups().map((headerGroup) => (
            <div
              key={headerGroup.id}
              role="row"
              className="border-b border-border/60"
              style={rowStyle}
            >
              {headerGroup.headers.map((header, i) => (
                <div
                  key={header.id}
                  role="columnheader"
                  className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap"
                  style={{
                    display: "table-cell",
                    width: COL_WIDTHS[i],
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Scrollable body — scrollbar starts below header */}
        <div
          ref={scrollRef}
          className="overflow-auto"
          style={{ height: "min(556px, calc(100vh - 19rem))" }}
        >
          <div style={{ minWidth: TABLE_MIN_WIDTH }}>
            <div
              role="rowgroup"
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                position: "relative",
              }}
            >
              {virtualItems.map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <div
                    key={row.id}
                    role="row"
                    data-index={virtualRow.index}
                    ref={(node) => virtualizer.measureElement(node)}
                    className="hover:bg-muted/50 border-b transition-colors cursor-pointer"
                    onClick={() => onViewDetails(row.original)}
                    style={{
                      ...rowStyle,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    aria-rowindex={virtualRow.index + 1}
                  >
                    {row.getVisibleCells().map((cell, i) => (
                      <div
                        key={cell.id}
                        role="cell"
                        className="p-2 align-middle whitespace-nowrap"
                        style={{
                          display: "table-cell",
                          width: COL_WIDTHS[i],
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <p className="text-muted-foreground text-xs">
          {rows.length.toLocaleString()} accounts (virtualized)
        </p>
        <p className="text-muted-foreground text-xs">
          Rendering {virtualItems.length} of {rows.length.toLocaleString()} DOM
          rows
        </p>
      </div>
    </div>
  );
}
