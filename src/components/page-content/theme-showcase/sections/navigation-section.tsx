"use client";

import { ChevronDown, Home, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavigationSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Navigation</h2>
        <p className="text-sm text-muted-foreground">
          Dropdown menus.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Dropdown Menu
        </p>
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Actions <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Home className="size-4" /> Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="size-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="size-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                Delete Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </section>
  );
}
