"use client";

import { BadgeCheck, IdCard, LogOut, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProfileDetails({ onSignOut }: { onSignOut: () => void }) {
  return (
    <div className="bg-muted/50 flex min-h-screen flex-1 flex-col gap-6 rounded-xl p-6 md:min-h-min">
      <div className="flex w-full justify-between border-b border-border/60">
        <div className="flex flex-col gap-6 pb-5">
          <div className="flex items-center gap-4">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-12 items-center justify-center rounded-2xl text-sm font-semibold">
              JD
            </div>
            <div>
              <p className="text-base font-semibold">John Doe</p>
              <p className="text-muted-foreground text-sm">
                Enterprise account · MoneyX
              </p>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onSignOut}>
          <LogOut className="size-4" />
          Sign out
        </Button>
      </div>

      <div className="grid gap-6 pt-6 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-5">
          <div>
            <div className="text-muted-foreground flex items-center gap-2 text-xs uppercase tracking-wide">
              <Mail className="size-4" />
              Login email
            </div>
            <div className="mt-2 rounded-xl border border-border/60 bg-background px-3 py-2 text-sm">
              jdoe@moneyx.com
            </div>
            <p className="text-muted-foreground mt-1 text-xs min-h-4">
              Email associated with your account. This cannot be modified.
            </p>
          </div>

          <div>
            <div className="text-muted-foreground flex items-center gap-2 text-xs uppercase tracking-wide">
              <BadgeCheck className="size-4" />
              KYB status
            </div>
            <div className="mt-2 rounded-xl border border-border/60 bg-background px-3 py-2 text-sm">
              Verified
            </div>
            <p className="text-muted-foreground mt-1 text-xs min-h-4">
              Business verification completed on Jan 20, 2024
            </p>
          </div>
        </div>

        <div className="space-y-5 lg:pr-6">
          <div>
            <div className="text-muted-foreground flex items-center gap-2 text-xs uppercase tracking-wide">
              <IdCard className="size-4" />
              Customer ID
            </div>
            <div className="mt-2 rounded-xl border border-border/60 bg-background px-3 py-2 text-sm">
              customer_916725ea2ed34acbab9b8b92b9802284
            </div>
            <p className="text-muted-foreground mt-1 text-xs min-h-4">&nbsp;</p>
          </div>

          <div>
            <div className="text-muted-foreground flex items-center gap-2 text-xs uppercase tracking-wide">
              <Phone className="size-4" />
              Telephone number
            </div>
            <div className="mt-2 rounded-xl border border-border/60 bg-background px-3 py-2 text-sm text-muted-foreground">
              +1 777-777-7777
            </div>
            <p className="text-muted-foreground mt-1 text-xs min-h-4">&nbsp;</p>
          </div>
        </div>
      </div>
    </div>
  );
}
