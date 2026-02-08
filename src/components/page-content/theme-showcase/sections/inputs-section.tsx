"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function InputsSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Inputs & Forms</h2>
        <p className="text-sm text-muted-foreground">
          Text inputs, select dropdowns, and form field layouts.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Default Input</label>
          <Input placeholder="Enter your name..." />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Disabled Input</label>
          <Input placeholder="Cannot edit" disabled value="Locked value" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Error State</label>
          <Input placeholder="Invalid email" aria-invalid="true" defaultValue="not-an-email" />
          <p className="text-xs text-destructive">Please enter a valid email address.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">File Input</label>
          <Input type="file" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Choose a currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usd">USD — US Dollar</SelectItem>
              <SelectItem value="eur">EUR — Euro</SelectItem>
              <SelectItem value="gbp">GBP — British Pound</SelectItem>
              <SelectItem value="usdc">USDC — USD Coin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Disabled Select</label>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Not available" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="x">X</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
