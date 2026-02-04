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
          ? "bg-emerald-500/8 text-emerald-700 border border-emerald-500/15 dark:text-emerald-300 dark:bg-emerald-400/10 dark:border-emerald-400/20"
          : "bg-amber-500/8 text-amber-800 border border-amber-500/15 dark:text-amber-300 dark:bg-amber-400/10 dark:border-amber-400/20",
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
