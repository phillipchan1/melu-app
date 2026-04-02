import * as React from "react";
import { Clock } from "lucide-react";

import { cn } from "../ui/utils";

const CUISINE_RING = "border border-[#7C9E7A] text-[#7C9E7A]";

interface MealCardProps extends React.ComponentProps<"div"> {
  day: string;
  date?: number;
  name: string;
  time?: string;
  cuisine?: string;
  ingredients?: string;
  /** Staple vs aspiration drives fixed reason pill per PG-02 */
  sourceType?: "staple" | "aspiration";
}

function MealCard({
  className,
  day,
  date,
  name,
  time,
  cuisine,
  ingredients,
  sourceType,
  ...props
}: MealCardProps) {
  const reasonLabel =
    sourceType === "aspiration"
      ? "You wanted to try this"
      : sourceType === "staple"
        ? "Your go-to"
        : null;

  return (
    <div
      data-slot="meal-card"
      className={cn(
        "bg-card rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] min-w-0 flex flex-col gap-3",
        "lg:min-h-[320px] lg:justify-between",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col shrink-0 gap-3">
        <div className={cn("shrink-0", date != null && "lg:border-b lg:border-border lg:pb-2")}>
          <div className="text-[11px] text-muted-foreground tracking-[0.08em] font-semibold">
            {day}
          </div>
          {date != null && (
            <div className="text-2xl font-semibold text-muted-foreground mt-1 hidden lg:block">
              {date}
            </div>
          )}
        </div>
        <h2 className="text-[17px] text-foreground font-semibold lg:min-h-[4.5rem] lg:line-clamp-3">
          {name}
        </h2>
        {time && (
          <div className="flex items-center gap-1 w-full shrink-0">
            <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
            <span className="text-[13px] text-muted-foreground font-normal">{time}</span>
          </div>
        )}
        {cuisine && (
          <div
            className={cn(
              "inline-flex self-start items-center rounded-full px-2 py-0.5 text-[10px] font-medium leading-none",
              CUISINE_RING,
            )}
          >
            {cuisine}
          </div>
        )}
      </div>
      {reasonLabel && (
        <div className="mt-auto shrink-0">
          {sourceType === "staple" ? (
            <span className="inline-flex rounded-full bg-primary px-2.5 py-1 text-[12px] font-medium text-primary-foreground">
              {reasonLabel}
            </span>
          ) : (
            <span
              className={cn(
                "inline-flex rounded-full border border-dashed px-2.5 py-1 text-[12px] font-medium",
                CUISINE_RING,
              )}
            >
              {reasonLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export { MealCard };
