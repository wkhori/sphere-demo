/* eslint-disable @next/next/no-img-element */
// components/ui/asset-icon.tsx
"use client";

import { CircleFlag } from "react-circle-flags";
import { cn } from "@/lib/utils";
import { PayoutCurrency, PayoutNetwork, CURRENCY_META } from "@/lib/types";
import { CRYPTO_ICONS, getBankLogo, getCryptoIcon } from "@/lib/icons";
import { Building2, Wallet } from "lucide-react";

type AssetType =
  | { type: "currency"; currency: PayoutCurrency }
  | { type: "network"; network: PayoutNetwork }
  | { type: "bank"; bankName: string };

type AssetIconProps = AssetType & {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function AssetIcon(props: AssetIconProps) {
  const { size = "md", className } = props;
  const sizeClass = sizeClasses[size];

  const wrapperClass = cn(
    "inline-flex items-center justify-center overflow-hidden rounded-full ring-1 ring-border/50 bg-background",
    sizeClass,
    className,
  );

  // --- BANK ---
  if (props.type === "bank") {
    const logo = getBankLogo(props.bankName);
    if (logo) {
      return (
        <span className={wrapperClass}>
          <img
            src={logo}
            alt={props.bankName}
            className="h-full w-full object-contain"
          />
        </span>
      );
    }
    // Fallback: generic bank icon
    return (
      <span className={cn(wrapperClass, "bg-muted")}>
        <Building2 className="h-1/2 w-1/2 text-muted-foreground" />
      </span>
    );
  }

  // --- CURRENCY (fiat or crypto) ---
  if (props.type === "currency") {
    const meta = CURRENCY_META[props.currency];

    // Fiat with country code → flag
    if (meta?.countryCode) {
      return (
        <span className={wrapperClass}>
          <CircleFlag
            countryCode={meta.countryCode}
            height="100%"
            width="100%"
          />
        </span>
      );
    }

    // Crypto currency → icon
    const cryptoIcon = getCryptoIcon(props.currency);
    if (cryptoIcon) {
      return (
        <span className={wrapperClass}>
          <img
            src={cryptoIcon}
            alt={props.currency}
            className="h-full w-full object-cover"
          />
        </span>
      );
    }

    // Fallback: text
    return (
      <span className={cn(wrapperClass, "bg-muted text-[10px] font-semibold")}>
        {props.currency.toUpperCase().slice(0, 2)}
      </span>
    );
  }

  // --- NETWORK ---
  if (props.type === "network") {
    const icon = CRYPTO_ICONS[props.network];
    if (icon) {
      return (
        <span className={wrapperClass}>
          <img
            src={icon}
            alt={props.network}
            className="h-full w-full object-cover"
          />
        </span>
      );
    }

    // Fallback: wallet icon
    return (
      <span className={cn(wrapperClass, "bg-muted")}>
        <Wallet className="h-1/2 w-1/2 text-muted-foreground" />
      </span>
    );
  }

  return null;
}
