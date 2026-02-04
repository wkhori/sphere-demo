import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function AppHeader({
  parentLabel = "Payments",
  currentLabel = "Send Transfer",
}: {
  parentLabel?: string | null;
  currentLabel?: string;
}) {
  const showParent = Boolean(parentLabel);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {showParent ? (
              <>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">{parentLabel}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </>
            ) : null}
            <BreadcrumbItem>
              <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2 pr-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
