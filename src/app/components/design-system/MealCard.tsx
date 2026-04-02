import * as React from "react";
import { Clock, Sparkles } from "lucide-react";

import { cn } from "../ui/utils";

interface MealCardProps extends React.ComponentProps<"div"> {
  day: string;
  date?: number;
  name: string;
  time?: string;
  cuisine?: string;
  ingredients?: string;
  reason?: string;
}

function MealCard({
  className,
  day,
  date,
  name,
  time,
  cuisine,
  ingredients,
  reason,
  ...props
}: MealCardProps) {
  return (
    <div
      data-slot="meal-card"
      className={cn(
        "bg-card rounded-2xl p-card shadow-[0_1px_4px_rgba(0,0,0,0.06)] min-w-0 flex flex-col",
        "lg:min-h-[320px] lg:justify-between",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col shrink-0">
        <div className={cn("shrink-0 mb-3", date != null && "lg:border-b lg:border-border lg:pb-2")}>
          <div className="text-[11px] text-muted-foreground tracking-[0.08em] font-normal">
            {day}
          </div>
          {date != null && (
            <div className="text-2xl font-semibold text-muted-foreground mt-1 hidden lg:block">
              {date}
            </div>
          )}
        </div>
        <h2 className="text-[20px] text-foreground font-semibold mb-3 lg:min-h-[4.5rem] lg:line-clamp-3">
          {name}
        </h2>
        {(time || cuisine) && (
          <div className="flex flex-col gap-2 w-full shrink-0">
            {time && (
              <div className="flex items-center justify-center gap-1 bg-secondary rounded-full px-2.5 py-1 w-full">
                <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="text-[13px] text-muted-foreground font-normal">
                  {time}
                </span>
              </div>
            )}
            {cuisine && (
              <div className="flex items-center justify-center bg-secondary rounded-full px-2.5 py-1 w-full">
                <span className="text-[13px] text-muted-foreground font-normal">
                  {cuisine}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      {reason && (
        <div className="flex items-center gap-1 mt-auto shrink-0">
          <Sparkles className="w-3 h-3 text-primary shrink-0" />
          <p className="text-[12px] text-primary font-normal">{reason}</p>
        </div>
      )}
    </div>
  );
}

export { MealCard };
