"use client";

import { AssetIcon } from "@/components/ui/asset-icon";
import { PayoutCurrency, PayoutNetwork } from "@/lib/types";

export function IconsSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Icons & Assets</h2>
        <p className="text-sm text-muted-foreground">
          AssetIcon component for currencies, networks, and banks.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Currencies
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {[PayoutCurrency.USD, PayoutCurrency.EUR, PayoutCurrency.GBP, PayoutCurrency.MXN, PayoutCurrency.USDC, PayoutCurrency.USDT].map(
            (currency) => (
              <div key={currency} className="flex flex-col items-center gap-1.5">
                <AssetIcon type="currency" currency={currency} size="md" />
                <span className="text-[10px] text-muted-foreground uppercase">{currency}</span>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Networks
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {[PayoutNetwork.ETH, PayoutNetwork.SOL, PayoutNetwork.POLYGON, PayoutNetwork.BASE, PayoutNetwork.TRON].map(
            (network) => (
              <div key={network} className="flex flex-col items-center gap-1.5">
                <AssetIcon type="network" network={network} size="md" />
                <span className="text-[10px] text-muted-foreground capitalize">{network}</span>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Banks
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {["Chase", "HSBC", "Bank of America", "Wells Fargo"].map((bank) => (
            <div key={bank} className="flex flex-col items-center gap-1.5">
              <AssetIcon type="bank" bankName={bank} size="md" />
              <span className="text-[10px] text-muted-foreground">{bank}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Sizes
        </p>
        <div className="flex items-end gap-4">
          <div className="flex flex-col items-center gap-1.5">
            <AssetIcon type="currency" currency={PayoutCurrency.USDC} size="sm" />
            <span className="text-[10px] text-muted-foreground">sm</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <AssetIcon type="currency" currency={PayoutCurrency.USDC} size="md" />
            <span className="text-[10px] text-muted-foreground">md</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <AssetIcon type="currency" currency={PayoutCurrency.USDC} size="lg" />
            <span className="text-[10px] text-muted-foreground">lg</span>
          </div>
        </div>
      </div>
    </section>
  );
}
