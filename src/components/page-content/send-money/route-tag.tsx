import type { RouteTag as RouteTagType } from "@/lib/send-money/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, Zap } from "lucide-react";

export const RouteTag = ({ tag }: { tag?: RouteTagType }) => {
  if (!tag) {
    return <span />;
  }

  const isBest = tag === "best value";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        isBest
          ? "bg-status-success/60 text-status-success-foreground border border-status-success"
          : "bg-status-warning/60 text-status-warning-foreground border border-status-warning",
      )}
    >
      {isBest ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <Zap className="h-3.5 w-3.5" />
      )}
      {isBest ? "best value" : "quickest"}
    </span>
  );
};
