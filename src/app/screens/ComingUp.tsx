import { useNavigate } from "react-router";

import { BottomNav } from "../components/BottomNav";
import { Button } from "../components/ui/button";
import { ScreenShell, TopBar } from "../components/design-system";

export function ComingUp() {
  const navigate = useNavigate();

  return (
    <ScreenShell className="pb-[76px]">
      <TopBar
        right={
          <button onClick={() => navigate("/profile")}>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-[14px] font-semibold">
                P
              </span>
            </div>
          </button>
        }
      />

      <div
        className="flex items-center justify-center text-center min-h-[calc(100vh-200px)]"
      >
        <div className="max-w-[280px]">
          <div className="text-[11px] text-muted-foreground tracking-[0.08em] mb-3 font-semibold">
            NEXT WEEK
          </div>

          <h1 className="text-[20px] text-foreground mb-3 font-semibold">
            Your next plan isn't ready yet.
          </h1>

          <p className="text-[15px] text-muted-foreground mb-8 font-normal leading-[1.5]">
            Melu will build it Sunday morning. Want it now?
          </p>

          <Button
            variant="melu"
            onClick={() => navigate("/weekly-checkin")}
            className="mb-4 text-[17px] font-semibold"
          >
            Generate this week's plan now
          </Button>

          <p className="text-[13px] text-muted-foreground font-normal">
            Melu will use your profile and this week's approvals.
          </p>
        </div>
      </div>

      <BottomNav activeTab="coming-up" />
    </ScreenShell>
  );
}