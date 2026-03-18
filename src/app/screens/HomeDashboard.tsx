import { useNavigate } from "react-router";

import { BottomNav } from "../components/BottomNav";
import { Button } from "../components/ui/button";
import {
  ScreenShell,
  TopBar,
  WeekSummaryCard,
} from "../components/design-system";

const WEEK_MEALS = [
  { day: "MON", meal: "Sheet Pan Lemon Chicken" },
  { day: "TUE", meal: "Beef Tacos" },
  { day: "WED", meal: "Pasta Primavera" },
  { day: "THU", meal: "Teriyaki Salmon" },
  { day: "FRI", meal: "BBQ Chicken Quesadillas" },
  { day: "SAT", meal: "Slow Cooker Pulled Pork" },
  { day: "SUN", meal: "One-Pan Roast Chicken" },
];

export function HomeDashboard() {
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

      <div className="mb-6">
        <h1 className="text-[18px] text-foreground mb-1 font-semibold">
          Good morning, Phil.
        </h1>
        <p className="text-[15px] text-muted-foreground font-normal">
          This week's plan is set.
        </p>
      </div>

      <div className="mb-6 space-y-2">
        <div className="text-[11px] text-muted-foreground tracking-[0.08em] font-semibold">
          THIS WEEK
        </div>
        <WeekSummaryCard
          items={WEEK_MEALS}
          footer={
            <button
              onClick={() => navigate("/plan")}
              className="text-[14px] text-primary font-normal"
            >
              View full plan →
            </button>
          }
        />
      </div>

      <div className="mb-4 text-center">
        <p className="text-[13px] text-muted-foreground font-normal">
          Next plan generates Sunday.
        </p>
      </div>

      <div>
        <Button
          variant="meluOutline"
          onClick={() => navigate("/grocery")}
          className="text-[16px] font-normal"
        >
          See this week's groceries
        </Button>
      </div>

      <BottomNav activeTab="this-week" />
    </ScreenShell>
  );
}