"use client";

import type { ComponentProps } from "react";

import { ArrowUpRight, BadgeDollarSign, Home, Landmark } from "lucide-react";

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
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <BadgeDollarSign className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">John Doe</span>
                  <span className="truncate text-xs">MoneyX</span>
                </div>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
