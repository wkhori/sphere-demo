import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function AppHeader({ label = "Send Transfer" }: { label?: string }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2 pr-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
