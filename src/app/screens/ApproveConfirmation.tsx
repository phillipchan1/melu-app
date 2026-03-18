import { Check } from "lucide-react";
import { useNavigate } from "react-router";

import { ScreenShell } from "../components/design-system";

export function ApproveConfirmation() {
  const navigate = useNavigate();

  return (
    <ScreenShell className="flex items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <div className="w-[52px] h-[52px] bg-primary/10 rounded-full flex items-center justify-center mb-5 ring-2 ring-primary/20">
          <Check className="w-6 h-6 text-primary" strokeWidth={2} />
        </div>

        <h1 className="text-[26px] text-foreground mb-3 font-semibold">
          You're all set.
        </h1>

        <div className="space-y-1 mb-8">
          <p className="text-[16px] text-muted-foreground font-normal leading-[1.6]">
            Your 7 dinners are set.
          </p>
          <p className="text-[16px] text-muted-foreground font-normal leading-[1.6]">
            Nobody has to ask what's for dinner this week.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => navigate("/grocery")}
            className="text-[16px] text-primary font-normal"
          >
            See your grocery list
          </button>
          <button
            onClick={() => navigate("/home")}
            className="text-[16px] text-muted-foreground font-normal"
          >
            Back to this week
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}