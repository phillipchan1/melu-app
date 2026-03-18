import * as React from "react";

import { cn } from "../ui/utils";

interface ResponseChipProps extends React.ComponentProps<"button"> {
  selected?: boolean;
}

function ResponseChip({
  className,
  selected = false,
  ...props
}: ResponseChipProps) {
  return (
    <button
      type="button"
      data-slot="response-chip"
      data-selected={selected}
      className={cn(
        "rounded-full px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer",
        "border border-border bg-card text-foreground",
        "hover:border-primary/50",
        selected && "border-primary bg-primary/10 text-primary",
        className,
      )}
      {...props}
    />
  );
}

export { ResponseChip };
