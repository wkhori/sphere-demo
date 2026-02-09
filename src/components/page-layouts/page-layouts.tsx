"use client";

import * as React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { AppHeader } from "./components/app-header";
import { AccountsView } from "@/components/page-content/accounts";
import { HomeContent } from "@/components/page-content/home";
import { ProfileDetails } from "@/components/page-content/profile-details";
import { SendMoney } from "@/components/page-content/send-money";
import { ThemeShowcase } from "@/components/page-content/theme-showcase";
import type { Account } from "@/lib/types";

type View = "home" | "send" | "accounts" | "profile" | "theme";

const VIEW_LABELS: Record<View, string> = {
  home: "Home",
  send: "Send Money",
  accounts: "My Accounts",
  profile: "Account Details",
  theme: "Theme",
};

// Reverse lookup: nav label → view (only for sidebar-navigable views)
const NAV_LABEL_TO_VIEW: Record<string, View> = {
  Home: "home",
  "Send Money": "send",
  "My Accounts": "accounts",
  "All Accounts": "accounts",
};

export default function Page() {
  const [activeView, setActiveView] = React.useState<View>("home");
  const [sendPrefill, setSendPrefill] = React.useState<
    { from?: Account; to?: Account; amount?: number } | undefined
  >(undefined);

  const navigateTo = (view: View) => {
    setActiveView(view);
    if (view !== "send") setSendPrefill(undefined);
  };

  const handleNavSelect = (title: string) => {
    const view = NAV_LABEL_TO_VIEW[title];
    if (view) navigateTo(view);
  };

  const handleRepeatLast = (prefill: {
    from?: Account;
    to?: Account;
    amount: number;
  }) => {
    setActiveView("send");
    setSendPrefill(prefill);
  };

  const handleAccountSelect = (account: Account) => {
    setActiveView("send");
    setSendPrefill(
      account.ownership === "self" ? { from: account } : { to: account },
    );
  };

  return (
    <SidebarProvider>
      <AppSidebar
        onProfileSelect={() => navigateTo("profile")}
        isProfileActive={activeView === "profile"}
        onNavSelect={handleNavSelect}
        activeNav={
          activeView === "home" ||
          activeView === "send" ||
          activeView === "accounts"
            ? VIEW_LABELS[activeView]
            : undefined
        }
      />
      <SidebarInset>
        <AppHeader label={VIEW_LABELS[activeView]} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {activeView === "profile" ? (
            <ProfileDetails
              onSignOut={() => navigateTo("home")}
              onThemeSettings={() => navigateTo("theme")}
            />
          ) : activeView === "accounts" ? (
            <AccountsView onSelectAccount={handleAccountSelect} />
          ) : activeView === "send" ? (
            <SendMoney
              prefill={sendPrefill}
              onNavigate={(view) => navigateTo(view)}
            />
          ) : activeView === "theme" ? (
            <ThemeShowcase />
          ) : (
            <HomeContent
              onNavigate={(view) => navigateTo(view)}
              onRepeatLast={handleRepeatLast}
              onThemeSettings={() => navigateTo("theme")}
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
