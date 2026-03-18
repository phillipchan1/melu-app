import { Send } from "lucide-react";
import { useNavigate } from "react-router";

import { ChatBubble, ResponseChip, ScreenShell } from "../components/design-system";

export function WeeklyCheckIn() {
  const navigate = useNavigate();

  const handleGeneratePlan = () => {
    setTimeout(() => navigate("/plan"), 500);
  };

  return (
    <ScreenShell className="flex flex-col relative">
      <div className="pt-12 pb-6 text-center">
        <div className="text-[22px] text-primary font-semibold">
          melu
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 space-y-3 flex flex-col">
        <ChatBubble variant="ai">
          <p className="text-[15px] text-foreground font-normal">
            Hey Phil — ready to plan this week. Anything I should know before I build your dinners?
          </p>
        </ChatBubble>

        <ChatBubble variant="user">
          <p className="text-[15px] text-primary-foreground font-normal">
            We have soccer Thursday so something really fast that night.
          </p>
        </ChatBubble>

        <ChatBubble variant="ai">
          <p className="text-[15px] text-foreground font-normal">
            Got it — I'll put a 20-minute meal on Thursday. Anything else, or should I start building?
          </p>
        </ChatBubble>

        <div className="flex gap-2">
          <ResponseChip onClick={handleGeneratePlan}>
            Build my plan
          </ResponseChip>
          <ResponseChip>One more thing...</ResponseChip>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-page py-3 max-w-[375px] mx-auto">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-secondary rounded-full px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground outline-none border border-border font-normal"
          />
          <button className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Send className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}