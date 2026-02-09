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
          ? "bg-primary/15 text-primary border border-primary/40"
          : "bg-secondary text-secondary-foreground border border-secondary",
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
