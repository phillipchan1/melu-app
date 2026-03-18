import * as React from "react";
import { Clock, Sparkles } from "lucide-react";

import { cn } from "../ui/utils";

interface MealCardProps extends React.ComponentProps<"div"> {
  day: string;
  name: string;
  time?: string;
  cuisine?: string;
  ingredients?: string;
  reason?: string;
}

function MealCard({
  className,
  day,
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
      className={cn("bg-card rounded-2xl p-card shadow-[0_1px_4px_rgba(0,0,0,0.06)]", className)}
      {...props}
    >
      <div className="text-[11px] text-muted-foreground tracking-[0.08em] mb-2 font-normal">
        {day}
      </div>
      <h2 className="text-[20px] text-foreground font-semibold mb-3">{name}</h2>
      {(time || cuisine) && (
        <div className="flex gap-2 mb-3">
          {time && (
            <div className="flex items-center gap-1 bg-secondary rounded-full px-2.5 py-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-[13px] text-muted-foreground font-normal">
                {time}
              </span>
            </div>
          )}
          {cuisine && (
            <div className="bg-secondary rounded-full px-2.5 py-1">
              <span className="text-[13px] text-muted-foreground font-normal">
                {cuisine}
              </span>
            </div>
          )}
        </div>
      )}
      {ingredients && (
        <p className="text-[14px] text-muted-foreground italic mb-2 font-normal">
          {ingredients}
        </p>
      )}
      {reason && (
        <div className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-primary" />
          <p className="text-[12px] text-primary font-normal">{reason}</p>
        </div>
      )}
    </div>
  );
}

export { MealCard };
