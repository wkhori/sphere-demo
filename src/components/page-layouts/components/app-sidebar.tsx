"use client";

import type { ComponentProps } from "react";

import {
  ArrowUpRight,
  Home,
  Landmark,
  MoreHorizontal,
} from "lucide-react";

import { NavMain } from "./nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
  const { brand } = useBrand();

  const handleProfileSelect = () => {
    onProfileSelect?.();
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar variant="inset" {...props}>
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
                <BrandLogo size="md" />
                <div className="flex flex-1 items-center gap-2 text-left text-sm leading-tight">
                  <div className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
                      {mockUserProfile.name}
                    </span>
                    <span className="block truncate text-xs">
                      {brand?.tenantName ?? mockUserProfile.organization}
                    </span>
                  </div>
                  <MoreHorizontal className="size-4 shrink-0 text-muted-foreground" />
                </div>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
