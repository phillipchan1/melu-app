import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import type { Meal, Plan } from "../lib/api";
import { approvePlan, generatePlan, normalizePlan } from "../lib/api";

import { useWeeklyPlanStore } from "../stores/weeklyPlanStore";
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

const DAY_TO_ABBREV: Record<string, string> = {
  monday: "MON",
  tuesday: "TUE",
  wednesday: "WED",
  thursday: "THU",
  friday: "FRI",
  saturday: "SAT",
  sunday: "SUN",
};

function dayAbbrev(day: string): string {
  const key = day.trim().toLowerCase();
  return DAY_TO_ABBREV[key] ?? day.slice(0, 3).toUpperCase();
}

function mealToCardProps(meal: Meal, weekStart?: string) {
  let date: number | undefined;
  if (weekStart) {
    const base = new Date(weekStart);
    const offset = DAY_OFFSETS[meal.day] ?? 0;
    const d = new Date(base);
    d.setDate(base.getDate() + offset);
    date = d.getDate();
  }
  const st = meal.sourceType;
  const sourceType = st === "staple" || st === "aspiration" ? st : undefined;
  return {
    day: dayAbbrev(meal.day),
    date,
    name: meal.name,
    time: `${meal.cookTime} min`,
    cuisine: meal.cuisine,
    sourceType,
  };
}

export function WeeklyPlanView() {
  const navigate = useNavigate();
  const location = useLocation();
  const planFromNav = (location.state as { plan?: Plan } | null)?.plan;
  const storedPlan = useWeeklyPlanStore((s) => s.currentPlan);
  const setCurrentPlan = useWeeklyPlanStore((s) => s.setCurrentPlan);
  const lastPlanRequest = useWeeklyPlanStore((s) => s.lastPlanRequest);
  const setLastPlanRequest = useWeeklyPlanStore((s) => s.setLastPlanRequest);

  const [plan, setPlan] = useState<Plan | null>(planFromNav ?? storedPlan ?? null);
  const [approving, setApproving] = useState(false);
  const [approveError, setApproveError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [regenerateError, setRegenerateError] = useState<string | null>(null);

  useEffect(() => {
    if (planFromNav?.meals?.length) {
      const p = normalizePlan(planFromNav);
      setPlan(p);
      setCurrentPlan(p);
    } else if (storedPlan?.meals?.length && !planFromNav) {
      setPlan(normalizePlan(storedPlan));
    }
  }, [planFromNav, storedPlan, setCurrentPlan]);

  const effectivePlan = planFromNav ?? storedPlan;
  const shouldRedirectToHome = !effectivePlan?.meals?.length;

  useLayoutEffect(() => {
    if (shouldRedirectToHome) {
      navigate("/home", { replace: true });
    }
  }, [shouldRedirectToHome, navigate]);

  if (shouldRedirectToHome) {
    return null;
  }

  const planForUi = plan ?? normalizePlan(effectivePlan);

  const n = planForUi.meals.length;

  const handleApprove = async () => {
    setApproveError(null);
    if (!planForUi.id || String(planForUi.id).trim() === "") {
      setApproveError("Missing plan id. Generate a new plan and try again.");
      return;
    }
    setApproving(true);
    try {
      await approvePlan(String(planForUi.id).trim());
      const approved = normalizePlan({ ...planForUi, status: "approved" });
      setPlan(approved);
      setCurrentPlan(approved);
      navigate("/home?approved=true");
    } catch (e) {
      setApproveError(e instanceof Error ? e.message : "Could not approve plan");
    } finally {
      setApproving(false);
    }
  };

  const handleTryDifferent = async () => {
    if (!lastPlanRequest) return;
    setRegenerateError(null);
    setRegenerating(true);
    try {
      const todayDate = new Date().toISOString();
      const newPlan = await generatePlan({
        selectedNights: lastPlanRequest.selectedNights,
        weeklyContext: lastPlanRequest.weeklyContext,
        todayDate,
      });
      setPlan(newPlan);
      setCurrentPlan(newPlan);
      setLastPlanRequest({
        ...lastPlanRequest,
        todayDate,
      });
    } catch {
      setRegenerateError("Couldn't generate a new plan. Try again.");
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <ScreenShell className="pb-32 max-w-[375px] lg:max-w-7xl relative">
      {regenerating && (
        <div className="fixed inset-0 z-20 flex flex-col items-center justify-center bg-white/85 px-page">
          <div className="text-[22px] text-primary font-semibold mb-3">melu</div>
          <p className="text-[14px] text-[#78716C]">
            Generating a new plan
            <span className="inline-block w-[1.2em] text-left animate-pulse">...</span>
          </p>
        </div>
      )}

      <div className="pt-12 pb-6">
        <h1 className="text-[24px] text-foreground mb-2 font-semibold">
          Your week, sorted.
        </h1>
        <p className="text-[15px] text-muted-foreground font-normal">
          {n} {n === 1 ? "dinner" : "dinners"}, ready to go.
        </p>
      </div>

      {approveError && (
        <p className="text-sm text-destructive mb-4 px-1" role="alert">
          {approveError}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-3">
        {planForUi.meals.map((meal, index) => (
          <MealCard
            key={`${planForUi.id}-${meal.day}-${index}`}
            {...mealToCardProps(meal, planForUi.weekStart)}
          />
        ))}
      </div>

      {lastPlanRequest ? (
        <div className="mt-4 flex flex-col items-center">
          <button
            type="button"
            onClick={() => void handleTryDifferent()}
            disabled={regenerating}
            className="text-[14px] text-[#78716C] text-center hover:underline mt-4 mb-6 disabled:opacity-50"
          >
            Try a different plan
          </button>
          {regenerateError && (
            <p className="text-[13px] text-[#B91C1C] mb-2" role="alert">
              {regenerateError}
            </p>
          )}
        </div>
      ) : null}

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[375px] px-page">
        <Button
          variant="melu"
          onClick={() => void handleApprove()}
          disabled={approving || regenerating}
          className="text-[17px] font-semibold w-full h-14 rounded-full"
        >
          {approving ? "Approving…" : "Looks good — approve plan"}
        </Button>
      </div>
    </ScreenShell>
  );
}
