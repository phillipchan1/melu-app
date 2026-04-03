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

function BuildingPlanLoadingDots() {
  const [dotCount, setDotCount] = useState(1);
  useEffect(() => {
    const t = globalThis.setInterval(() => {
      setDotCount((c) => (c >= 3 ? 1 : c + 1));
    }, 600);
    return () => globalThis.clearInterval(t);
  }, []);
  return (
    <div className="fixed inset-0 z-20 flex flex-col items-center justify-center bg-[#FAF8F5] px-page">
      <div className="mb-3 text-[22px] font-semibold text-[#7C9E7A]">melu</div>
      <p className="text-[15px] font-normal text-[#78716C]">
        Building your plan{".".repeat(dotCount)}
      </p>
    </div>
  );
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

  // Sync from navigation state only — do not depend on `storedPlan` here: calling
  // setCurrentPlan updates the store and would retrigger this effect forever.
  useEffect(() => {
    if (!planFromNav?.meals?.length) return;
    const p = normalizePlan(planFromNav);
    setPlan(p);
    setCurrentPlan(p);
  }, [planFromNav, setCurrentPlan]);

  // Hydrate from zustand when there is no plan in location state (e.g. refresh).
  useEffect(() => {
    if (planFromNav?.meals?.length) return;
    if (!storedPlan?.meals?.length) return;
    setPlan(normalizePlan(storedPlan));
  }, [planFromNav, storedPlan]);

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
    <ScreenShell className="relative pb-32 text-left max-w-[375px] lg:max-w-7xl">
      {regenerating && <BuildingPlanLoadingDots />}

      <div className="pt-12 pb-6">
        <h1 className="mb-2 text-[24px] font-semibold text-foreground">
          Here&apos;s your week.
        </h1>
        <p className="mb-0 text-[14px] font-normal text-[#78716C]">
          {n} {n === 1 ? "dinner" : "dinners"}, ready to go.
        </p>
        {planForUi.planSummary != null && planForUi.planSummary.trim() !== "" ? (
          <p
            style={{
              fontSize: "15px",
              color: "#78716C",
              fontStyle: "italic",
              lineHeight: "1.5",
              marginBottom: "20px",
              textAlign: "left",
            }}
          >
            {planForUi.planSummary.trim()}
          </p>
        ) : null}
      </div>

      {approveError && (
        <p className="mb-4 px-1 text-left text-sm text-destructive" role="alert">
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
        <div className="mt-4 flex flex-col items-stretch text-left">
          <button
            type="button"
            onClick={() => void handleTryDifferent()}
            disabled={regenerating}
            className="mb-6 mt-4 text-left text-[14px] text-[#78716C] hover:underline disabled:opacity-50"
          >
            Try a different plan
          </button>
          {regenerateError && (
            <p className="mb-2 text-left text-[13px] text-[#B91C1C]" role="alert">
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
