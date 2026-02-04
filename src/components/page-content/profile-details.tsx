"use client";

import { BadgeCheck, IdCard, LogOut, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockUserProfile } from "@/lib/mock-data";

export function ProfileDetails({ onSignOut }: { onSignOut: () => void }) {
  const kybVerifiedAt = mockUserProfile.kybVerifiedAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(mockUserProfile.kybVerifiedAt)
    : null;

  return (
    <div className="bg-muted/50 flex min-h-screen flex-1 flex-col gap-6 rounded-xl p-6 md:min-h-min">
      <div className="flex w-full flex-col gap-4 border-b border-border/60 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-12 items-center justify-center rounded-2xl text-sm font-semibold">
              {mockUserProfile.initials}
            </div>
            <div className="min-w-0">
              <p className="text-base font-semibold">{mockUserProfile.name}</p>
              <p className="text-muted-foreground text-sm">
                {mockUserProfile.plan} account · {mockUserProfile.organization}
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
            <div className="mt-2 break-all rounded-xl border border-border/60 bg-background px-3 py-2 text-sm">
              {mockUserProfile.email}
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
              {mockUserProfile.kybStatus}
            </div>
            <p className="text-muted-foreground mt-1 text-xs min-h-4">
              {kybVerifiedAt
                ? `Business verification completed on ${kybVerifiedAt}`
                : "Business verification date not available."}
            </p>
          </div>
        </div>

        <div className="space-y-5 lg:pr-6">
          <div>
            <div className="text-muted-foreground flex items-center gap-2 text-xs uppercase tracking-wide">
              <IdCard className="size-4" />
              Customer ID
            </div>
            <div className="mt-2 break-all rounded-xl border border-border/60 bg-background px-3 py-2 text-sm">
              {mockUserProfile.customerId}
            </div>
            <p className="text-muted-foreground mt-1 text-xs min-h-4">&nbsp;</p>
          </div>

          <div>
            <div className="text-muted-foreground flex items-center gap-2 text-xs uppercase tracking-wide">
              <Phone className="size-4" />
              Telephone number
            </div>
            <div className="mt-2 rounded-xl border border-border/60 bg-background px-3 py-2 text-sm text-muted-foreground">
              {mockUserProfile.phone}
            </div>
            <p className="text-muted-foreground mt-1 text-xs min-h-4">&nbsp;</p>
          </div>
        </div>
      </div>
    </div>
  );
}
