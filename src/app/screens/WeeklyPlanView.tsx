import { useLocation, useNavigate } from "react-router";
import type { Meal, Plan } from "../lib/api";

import { BottomNav } from "../components/BottomNav";
import { Button } from "../components/ui/button";
import { MealCard, ScreenShell } from "../components/design-system";

const DAY_OFFSETS: Record<string, number> = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

function mealToCardProps(meal: Meal, weekStart?: string) {
  let date: number | undefined;
  if (weekStart) {
    const base = new Date(weekStart);
    const offset = DAY_OFFSETS[meal.day] ?? 0;
    const d = new Date(base);
    d.setDate(base.getDate() + offset);
    date = d.getDate();
  }
  return {
    day: meal.day.toUpperCase(),
    date,
    name: meal.name,
    time: `${meal.cookTime} min`,
    cuisine: meal.cuisine,
    ingredients: Array.isArray(meal.ingredients) ? meal.ingredients.join(", ") : "",
    reason: meal.reasonTag ?? "",
  };
}

export function WeeklyPlanView() {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = (location.state as { plan?: Plan } | null)?.plan;

  if (!plan?.meals?.length) {
    return (
      <ScreenShell className="pb-[136px] flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-[24px] text-foreground mb-2 font-semibold text-center">
          No plan yet
        </h1>
        <p className="text-[15px] text-muted-foreground text-center max-w-xs mb-6">
          Complete onboarding and build your first plan to see your week here.
        </p>
        <Button variant="melu" onClick={() => navigate("/onboarding")}>
          Go to onboarding
        </Button>
        <BottomNav activeTab="this-week" />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell className="pb-[136px] max-w-[375px] lg:max-w-7xl">
      <div className="pt-12 pb-6">
        <h1 className="text-[24px] text-foreground mb-2 font-semibold">
          Your week, sorted.
        </h1>
        <p className="text-[15px] text-muted-foreground font-normal">
          7 dinners, ready to go.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {plan.meals.map((meal) => (
          <MealCard
            key={meal.day}
            {...mealToCardProps(meal, plan.weekStart)}
          />
        ))}
      </div>

      <div className="fixed bottom-[76px] left-1/2 -translate-x-1/2 w-full max-w-[375px] px-page">
        <Button
          variant="melu"
          onClick={() => navigate("/confirmation")}
          className="text-[17px] font-semibold w-full"
        >
          Looks good – approve this week
        </Button>
      </div>

      <BottomNav activeTab="this-week" />
    </ScreenShell>
  );
}