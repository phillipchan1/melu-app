import * as React from "react";

import { MeluCard } from "./MeluCard";
import { cn } from "../ui/utils";

interface DayMeal {
  day: string;
  meal: string;
}

interface WeekSummaryCardProps extends Omit<React.ComponentProps<"div">, "children"> {
  items: DayMeal[];
  footer?: React.ReactNode;
}

function WeekSummaryCard({
  className,
  items,
  footer,
  ...props
}: WeekSummaryCardProps) {
  return (
    <MeluCard className={className} {...props}>
      {items.map((item, index) => (
        <div key={item.day}>
          <div className="flex items-center justify-between py-2">
            <span className="text-[12px] text-muted-foreground font-normal">
              {item.day}
            </span>
            <span className="text-[15px] text-foreground flex-1 text-right font-normal">
              {item.meal}
            </span>
          </div>
          {index < items.length - 1 && (
            <div className="border-t border-border-subtle" />
          )}
        </div>
      ))}
      {footer && <div className="mt-3 text-right">{footer}</div>}
    </MeluCard>
  );
}

export { WeekSummaryCard };
