import * as React from "react";

import { cn } from "../ui/utils";

type ChatBubbleVariant = "ai" | "user";

interface ChatBubbleProps extends React.ComponentProps<"div"> {
  variant: ChatBubbleVariant;
}

function ChatBubble({ className, variant, ...props }: ChatBubbleProps) {
  return (
    <div
      data-slot="chat-bubble"
      data-variant={variant}
      className={cn(
        "rounded-2xl px-4 py-3 max-w-[85%]",
        variant === "ai" &&
          "bg-secondary text-foreground self-start",
        variant === "user" &&
          "bg-primary text-primary-foreground self-end",
        className,
      )}
      {...props}
    />
  );
}

export { ChatBubble };
