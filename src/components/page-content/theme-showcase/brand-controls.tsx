"use client";

import * as React from "react";
import { Copy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBrand } from "@/components/brand-provider";
import { AVAILABLE_FONTS } from "@/lib/brand-config";
import { hexToOklch, oklchToHex } from "@/lib/color-utils";

/**
 * Read the live computed value of a CSS custom property from :root.
 */
function readCssVar(name: string): string | null {
  if (typeof document === "undefined") return null;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${name}`)
    .trim();
  return raw || null;
}

function ColorField({
  label,
  value,
  onChange,
  autoLabel,
  cssVarFallback,
}: {
  label: string;
  value: string | undefined;
  onChange: (oklch: string | undefined) => void;
  autoLabel?: string;
  /** CSS var name (without --) to read live default when value is undefined */
  cssVarFallback?: string;
}) {
  const resolvedValue = React.useMemo(() => {
    if (value) return value;
    if (!cssVarFallback) return undefined;
    return readCssVar(cssVarFallback) ?? undefined;
  }, [value, cssVarFallback]);

  const hex = resolvedValue
    ? (oklchToHex(resolvedValue) ?? "#000000")
    : "#000000";
  const isAuto = !value && !!autoLabel;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium">{label}</label>
        {autoLabel && (
          <button
            type="button"
            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            onClick={() =>
              onChange(isAuto ? (hexToOklch(hex) ?? undefined) : undefined)
            }
          >
            {isAuto ? "Override" : "Auto"}
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={isAuto ? "#888888" : hex}
          disabled={isAuto}
          onChange={(e) => {
            const oklch = hexToOklch(e.target.value);
            if (oklch) onChange(oklch);
          }}
          className="h-8 w-10 cursor-pointer rounded border border-border/40 bg-transparent p-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Input
          value={isAuto ? "" : hex}
          placeholder={isAuto ? "Auto-derived" : "#000000"}
          disabled={isAuto}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9a-fA-F]{6}$/.test(v)) {
              const oklch = hexToOklch(v);
              if (oklch) onChange(oklch);
            }
          }}
          className="h-8 font-mono text-xs"
        />
      </div>
    </div>
  );
}

export function BrandControlsPanel() {
  const { brand, updateBrand, setBrand, mode, setMode, allowDarkMode } =
    useBrand();
  const [copied, setCopied] = React.useState(false);

  const handleExport = () => {
    const config = brand ?? {};
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setBrand(null);
  };

  const radiusValue = brand?.radius ?? 10;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold">Brand Controls</h3>
        <p className="text-xs text-muted-foreground">
          Adjust tokens in real-time. Changes persist to localStorage.
        </p>
      </div>

      <div className="space-y-4">
        <ColorField
          label="Primary Color"
          value={brand?.primary}
          cssVarFallback="primary"
          onChange={(v) => {
            if (v) updateBrand({ primary: v });
          }}
        />

        <ColorField
          label="Secondary Color"
          value={brand?.secondary}
          cssVarFallback="secondary"
          onChange={(v) => updateBrand({ secondary: v })}
          autoLabel="secondary"
        />

        <ColorField
          label="Accent Color"
          value={brand?.accent}
          cssVarFallback="accent"
          onChange={(v) => updateBrand({ accent: v })}
          autoLabel="accent"
        />
      </div>

      <Separator />

      <div className="space-y-1.5">
        <label className="text-xs font-medium">
          Border Radius — {radiusValue}px
        </label>
        <input
          type="range"
          min={0}
          max={24}
          step={1}
          value={radiusValue}
          onChange={(e) => updateBrand({ radius: Number(e.target.value) })}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>0px</span>
          <span>24px</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-1.5">
        <label className="text-xs font-medium">Font Family</label>
        <Select
          value={brand?.fontFamily || "__default"}
          onValueChange={(v) =>
            updateBrand({ fontFamily: v === "__default" ? undefined : v })
          }
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Default (Geist)" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_FONTS.map((f) => (
              <SelectItem
                key={f.value || "__default"}
                value={f.value || "__default"}
              >
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium">Logo URL</label>
        <Input
          value={brand?.logoUrl ?? ""}
          placeholder="https://example.com/logo.svg"
          onChange={(e) =>
            updateBrand({ logoUrl: e.target.value || undefined })
          }
          className="h-8 text-xs"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium">Tenant Name</label>
        <Input
          value={brand?.tenantName ?? ""}
          placeholder="Acme Corp"
          onChange={(e) =>
            updateBrand({ tenantName: e.target.value || undefined })
          }
          className="h-8 text-xs"
        />
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium">Allow Dark Mode</label>
          <button
            type="button"
            role="switch"
            aria-checked={brand?.allowDarkMode !== false}
            onClick={() =>
              updateBrand({
                allowDarkMode: brand?.allowDarkMode === false ? true : false,
              })
            }
            className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-border/40 bg-muted transition-colors aria-checked:bg-primary"
          >
            <span
              className="pointer-events-none inline-block size-3.5 rounded-full bg-background shadow-sm transition-transform translate-x-0.5 aria-checked:translate-x-[18px]"
              aria-checked={brand?.allowDarkMode !== false}
            />
          </button>
        </div>
      </div>

      <Separator />

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleReset}
        >
          <RotateCcw className="size-3.5" />
          Reset
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleExport}
        >
          <Copy className="size-3.5" />
          {copied ? "Copied!" : "Export"}
        </Button>
      </div>
    </div>
  );
}
