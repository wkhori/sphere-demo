"use client";

import type { ComponentProps } from "react";

import {
  ArrowUpRight,
  ChevronsUpDown,
  Home,
  Landmark,
} from "lucide-react";

import { NavMain } from "./nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BrandLogo } from "@/components/ui/brand-logo";
import { useBrand } from "@/components/brand-provider";
import { mockUserProfile } from "@/lib/mock-data";

const data = {
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: Home,
    },
    {
      title: "Send Money",
      url: "#",
      icon: ArrowUpRight,
    },
    {
      title: "My Accounts",
      url: "#",
      icon: Landmark,
    },
  ],
};

function UserInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
      {initials}
    </div>
  );
}

export function AppSidebar({
  onProfileSelect,
  isProfileActive = false,
  onNavSelect,
  activeNav,
  ...props
}: ComponentProps<typeof Sidebar> & {
  onProfileSelect?: () => void;
  isProfileActive?: boolean;
  onNavSelect?: (title: string) => void;
  activeNav?: string;
}) {
  const { isMobile, setOpenMobile } = useSidebar();
  const { brand, hydrated } = useBrand();

  const handleProfileSelect = () => {
    onProfileSelect?.();
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className={`flex items-center gap-2.5 px-1 py-1.5 transition-opacity duration-150 ${hydrated ? "opacity-100" : "opacity-0"}`}>
              <BrandLogo size="lg" />
              {!brand?.logoUrl && (
                <span className="truncate text-sm font-semibold leading-tight">
                  {brand?.tenantName ?? mockUserProfile.organization}
                </span>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          <NavMain
            items={data.navMain}
            onSelect={onNavSelect}
            activeItem={activeNav}
          />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" isActive={isProfileActive} asChild>
              <button type="button" onClick={handleProfileSelect}>
                <UserInitials name={mockUserProfile.name} />
                <div className="flex flex-1 items-center gap-2 text-left text-sm leading-tight">
                  <div className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
                      {mockUserProfile.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {mockUserProfile.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
                </div>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
