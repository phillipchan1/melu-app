import * as React from "react";

import { cn } from "../ui/utils";

interface TopBarProps extends React.ComponentProps<"div"> {
  logo?: React.ReactNode;
  right?: React.ReactNode;
}

function TopBar({ className, logo, right, ...props }: TopBarProps) {
  return (
    <div
      data-slot="top-bar"
      className={cn(
        "flex items-center justify-between pt-12 pb-6",
        className,
      )}
      {...props}
    >
      <div className="text-[22px] text-primary font-semibold">
        {logo ?? "melu"}
      </div>
      {right}
    </div>
  );
}

export { TopBar };
