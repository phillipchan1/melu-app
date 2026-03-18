import * as React from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "../ui/utils";

interface ProfileRowCardProps extends React.ComponentProps<"button"> {
  label: string;
  value: string;
}

function ProfileRowCard({
  className,
  label,
  value,
  ...props
}: ProfileRowCardProps) {
  return (
    <button
      type="button"
      data-slot="profile-row-card"
      className={cn(
        "w-full bg-card rounded-2xl p-card shadow-[0_1px_4px_rgba(0,0,0,0.06)]",
        "flex items-center justify-between hover:bg-background transition-colors text-left",
        className,
      )}
      {...props}
    >
      <div className="flex-1">
        <div className="text-[15px] text-foreground font-semibold mb-1">
          {label}
        </div>
        <div className="text-[15px] text-muted-foreground font-normal">
          {value}
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-3" />
    </button>
  );
}

export { ProfileRowCard };
