import * as React from "react";

import { cn } from "../ui/utils";

interface ScreenShellProps extends React.ComponentProps<"div"> {}

function ScreenShell({ className, ...props }: ScreenShellProps) {
  return (
    <div
      data-slot="screen-shell"
      className={cn(
        "min-h-screen bg-background max-w-[375px] mx-auto px-page",
        className,
      )}
      {...props}
    />
  );
}

export { ScreenShell };
