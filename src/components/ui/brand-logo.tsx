/* eslint-disable @next/next/no-img-element */
"use client";

import { cn } from "@/lib/utils";
import { useBrand } from "@/components/brand-provider";
import { BadgeDollarSign } from "lucide-react";

/** Height constraints per size — width is unconstrained to respect aspect ratio */
const heightClasses = {
  sm: "h-5",
  md: "h-7",
  lg: "h-8",
} as const;

/** Fixed square sizes for the icon fallback */
const iconSizeClasses = {
  sm: "size-6",
  md: "size-8",
  lg: "size-10",
} as const;

const iconInnerClasses = {
  sm: "size-3",
  md: "size-4",
  lg: "size-5",
} as const;

export function BrandLogo({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { brand } = useBrand();

  if (brand?.logoUrl) {
    return (
      <img
        src={brand.logoUrl}
        alt={brand.logoAlt ?? brand.tenantName ?? "Logo"}
        className={cn(
          heightClasses[size],
          "w-auto max-w-full object-contain",
          className,
        )}
      />
    );
  }

  // Fallback: styled icon matching the sidebar primary
  return (
    <div
      className={cn(
        iconSizeClasses[size],
        "flex shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground",
        className,
      )}
    >
      <BadgeDollarSign className={iconInnerClasses[size]} />
    </div>
  );
}
