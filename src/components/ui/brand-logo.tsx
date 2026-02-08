/* eslint-disable @next/next/no-img-element */
"use client";

import { cn } from "@/lib/utils";
import { useBrand } from "@/components/brand-provider";
import { BadgeDollarSign } from "lucide-react";

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
} as const;

export function BrandLogo({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { brand } = useBrand();

  const sizeClass = sizeClasses[size];

  if (brand?.logoUrl) {
    return (
      <img
        src={brand.logoUrl}
        alt={brand.logoAlt ?? brand.tenantName ?? "Logo"}
        className={cn(sizeClass, "rounded-lg object-contain", className)}
      />
    );
  }

  // Fallback: styled icon matching the sidebar primary
  return (
    <div
      className={cn(
        sizeClass,
        "flex items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground",
        className,
      )}
    >
      <BadgeDollarSign className="size-4" />
    </div>
  );
}
