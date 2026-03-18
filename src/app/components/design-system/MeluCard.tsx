import * as React from "react";

import { cn } from "../ui/utils";

interface MeluCardProps extends React.ComponentProps<"div"> {}

function MeluCard({ className, ...props }: MeluCardProps) {
  return (
    <div
      data-slot="melu-card"
      className={cn(
        "bg-card rounded-2xl p-card shadow-[0_1px_4px_rgba(0,0,0,0.06)]",
        className,
      )}
      {...props}
    />
  );
}

export { MeluCard };
