"use client";

import * as React from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "./components/app-sidebar";
import { AppHeader } from "./components/app-header";
import { AccountsTable } from "@/components/page-content/accounts-table";
import { HomeContent } from "@/components/page-content/home";
import { ProfileDetails } from "@/components/page-content/profile-details";
import { SendMoney } from "@/components/page-content/send-money";
import type { Account } from "@/lib/types";

export default function Page() {
  const [activeView, setActiveView] = React.useState<
    "home" | "send" | "accounts" | "profile"
  >("home");
  const [sendPrefill, setSendPrefill] = React.useState<
    { from?: Account; to?: Account; amount?: number } | undefined
  >(undefined);

  const handleNavSelect = (title: string) => {
    if (title === "Home") {
      setActiveView("home");
      setSendPrefill(undefined);
      return;
    }
    if (title === "Send Money") {
      setActiveView("send");
      setSendPrefill(undefined);
      return;
    }
    if (title === "My Accounts" || title === "All Accounts") {
      setActiveView("accounts");
      setSendPrefill(undefined);
      return;
    }
  };

  const handleHomeNavigate = (view: "send" | "accounts") => {
    setActiveView(view === "send" ? "send" : "accounts");
    setSendPrefill(undefined);
  };

  const handleRepeatLast = (prefill: {
    from?: Account;
    to?: Account;
    amount: number;
  }) => {
    setActiveView("send");
    setSendPrefill(prefill);
  };

  const handleSendNavigate = (view: "home" | "accounts") => {
    setActiveView(view);
    setSendPrefill(undefined);
  };

  const handleAccountSelect = (account: Account) => {
    setActiveView("send");
    if (account.ownership === "self") {
      setSendPrefill({ from: account });
    } else {
      setSendPrefill({ to: account });
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar
        onProfileSelect={() => setActiveView("profile")}
        isProfileActive={activeView === "profile"}
        onNavSelect={handleNavSelect}
        activeNav={
          activeView === "home"
            ? "Home"
            : activeView === "send"
              ? "Send Money"
              : activeView === "accounts"
                ? "My Accounts"
                : undefined
        }
      />
      <SidebarInset>
        <AppHeader
          parentLabel={null}
          currentLabel={
            activeView === "profile"
              ? "Account Details"
              : activeView === "accounts"
                ? "My Accounts"
                : activeView === "send"
                  ? "Send Money"
                  : "Home"
          }
        />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {activeView === "profile" ? (
            <ProfileDetails onSignOut={() => setActiveView("home")} />
          ) : activeView === "accounts" ? (
            <AccountsTable onSelectAccount={handleAccountSelect} />
          ) : activeView === "send" ? (
            <SendMoney prefill={sendPrefill} onNavigate={handleSendNavigate} />
          ) : (
            <HomeContent
              onNavigate={handleHomeNavigate}
              onRepeatLast={handleRepeatLast}
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
