import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate, type NavigateFunction, type Location } from "react-router";

import { BottomNav } from "../components/BottomNav";
import { ScreenShell, TopBar } from "../components/design-system";
import { cn } from "../components/ui/utils";
import type { Meal, OnboardingAnswers, Plan, PlanStatus } from "../lib/api";
import { fetchCurrentWeekPlan } from "../lib/api";
import { clearChefCardCache } from "../lib/chefCardCache";
import { clearMealsPreviewCache, loadMealsPreviewCache } from "../lib/mealsPreviewCache";
import { parseOnboardingAnswers } from "../lib/meluSnapshotCopy";
import { supabase } from "../lib/supabase";
import { useWeeklyPlanStore } from "../stores/weeklyPlanStore";
import { Clock } from "lucide-react";

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const DAY_TO_ABBREV: Record<string, string> = {
  monday: "MON",
  tuesday: "TUE",
  wednesday: "WED",
  thursday: "THU",
  friday: "FRI",
  saturday: "SAT",
  sunday: "SUN",
};

function dayToAbbrev(day: string): string {
  const key = day.trim().toLowerCase();
  return DAY_TO_ABBREV[key] ?? day.slice(0, 3).toUpperCase();
}

function getWeekdayGreeting(): string {
  return `Good ${WEEKDAY_NAMES[new Date().getDay()]}`;
}

function effectivePlanStatus(plan: Plan): PlanStatus {
  return plan.status ?? "pending";
}

function greetingSubtitle(hasPlan: boolean, status: PlanStatus | null): string {
  if (!hasPlan) {
    return "Melu knows your family. Time to plan this week.";
  }
  if (status === "approved") {
    return "This week's plan is set.";
  }
  return "You've got a draft plan waiting for approval.";
}

function firstNameFromSessionUser(user: {
  user_metadata?: Record<string, unknown>;
  email?: string;
}): { firstName: string; initial: string } {
  const full = user.user_metadata?.full_name;
  const emailLocal = user.email?.split("@")[0] ?? "";
  const raw =
    typeof full === "string" && full.trim().length > 0 ? full.trim() : emailLocal || "there";
  const first = raw.split(/\s+/)[0] ?? raw;
  const initial = first.charAt(0).toUpperCase() || "?";
  return { firstName: first, initial };
}

type MealWithDayIndex = Meal & { dayIndex?: number };

/** Maps to Date.getDay(): 0 = Sunday … 6 = Saturday. */
function mealDayJsIndex(meal: Meal): number | undefined {
  const ext = meal as MealWithDayIndex;
  if (typeof ext.dayIndex === "number" && ext.dayIndex >= 0 && ext.dayIndex <= 6) {
    return ext.dayIndex;
  }
  const key = meal.day.trim().toLowerCase();
  const map: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  return map[key];
}

/** Prefer exact day match; else first meal on a future day this week (then wraps). */
function pickMealForAnchorDay(meals: Meal[], anchorJs: number): Meal | undefined {
  const withIdx = meals.filter((m) => mealDayJsIndex(m) !== undefined);
  if (withIdx.length === 0) return undefined;

  const exact = withIdx.find((m) => mealDayJsIndex(m) === anchorJs);
  if (exact) return exact;

  for (let delta = 1; delta <= 7; delta++) {
    const d = (anchorJs + delta) % 7;
    const hit = withIdx.find((m) => mealDayJsIndex(m) === d);
    if (hit) return hit;
  }
  return undefined;
}

/** Monday=1 … Saturday=6, Sunday=7 for Mon–Sun list order. Unknown last. */
function monSunSortRank(index: number | undefined): number {
  if (index === undefined) return 99;
  if (index === 0) return 7;
  return index;
}

function sortMealsMonThroughSun(meals: Meal[]): Meal[] {
  return [...meals].sort((a, b) => {
    return monSunSortRank(mealDayJsIndex(a)) - monSunSortRank(mealDayJsIndex(b));
  });
}

function ingredientsPreviewLine(meal: Meal): string {
  if (!meal.ingredients?.length) return "";
  return meal.ingredients.join(", ");
}

/** One line for Melu Knows You (desktop). Omits if household or cook time missing. */
function buildFamilyWeeknightLine(answers: OnboardingAnswers | null): string | null {
  if (!answers?.q1 || !answers.q6) return null;
  const total = (answers.q1.adults ?? 0) + (answers.q1.kids ?? 0);
  if (total <= 0) return null;
  const xByQ6: Record<string, string> = {
    under_20: "20",
    "30": "30",
    "45": "45",
    "60_plus": "60+",
  };
  const x = xByQ6[answers.q6] ?? "30";
  return `Family of ${total}. About ${x} min on weeknights.`;
}

const SECTION_LABEL_CLASS =
  "text-[11px] font-semibold uppercase tracking-[0.08em] text-[#78716C]";

function TonightHeroCard({ meal }: Readonly<{ meal: Meal }>) {
  const preview = ingredientsPreviewLine(meal);
  const noopSoon = () => {
    console.log("coming soon");
  };
  return (
    <div className="w-full rounded-2xl bg-white p-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-border/60">
      <p className={SECTION_LABEL_CLASS}>Tonight</p>
      <h2 className="mt-1.5 text-[24px] font-semibold text-[#1C1917] leading-tight">{meal.name}</h2>
      <div className="mt-2.5 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-[100px] bg-[#F0EFED] px-3 py-1 text-[13px] text-[#78716C]">
          <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {meal.cookTime} min
        </span>
        <span className="inline-flex items-center rounded-[100px] bg-[#F0EFED] px-3 py-1 text-[13px] text-[#78716C]">
          {meal.cuisine}
        </span>
      </div>
      {preview ? <p className="mt-2 text-[14px] italic text-[#78716C]">{preview}</p> : null}
      {meal.reasonTag ? (
        <p className="mt-1.5 text-[12px] text-[#7C9E7A]">
          <span aria-hidden>✓ </span>
          {meal.reasonTag}
        </p>
      ) : null}
      <div className="my-3.5 h-px bg-[#F0EFED]" aria-hidden />
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={noopSoon}
          className="text-left text-[14px] font-medium text-[#7C9E7A]"
        >
          View recipe
        </button>
        <button
          type="button"
          onClick={noopSoon}
          className="text-left text-[14px] font-medium text-[#7C9E7A]"
        >
          Get ingredients
        </button>
      </div>
      <button
        type="button"
        onClick={noopSoon}
        className="mt-2.5 block w-full text-left text-[13px] text-[#78716C]"
      >
        Need help with this dish? →
      </button>
    </div>
  );
}

function MeluKnowsYouDesktopCard({
  familyLine,
  stapleNames,
  aspirationName,
  onNavigateProfile,
}: Readonly<{
  familyLine: string | null;
  stapleNames: string[];
  aspirationName: string | null;
  onNavigateProfile: () => void;
}>) {
  const shownStaples = stapleNames.slice(0, 3);
  const rest = Math.max(0, stapleNames.length - 3);

  return (
    <div className="w-full rounded-2xl bg-white p-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-border/60">
      <p className={SECTION_LABEL_CLASS}>Melu knows you</p>

      {familyLine ? (
        <>
          <p className="mt-3 text-[14px] text-[#1C1917]">{familyLine}</p>
          <div className="my-3 h-px bg-[#F0EFED]" aria-hidden />
        </>
      ) : null}

      <button
        type="button"
        onClick={onNavigateProfile}
        className={cn(
          "w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg",
          !familyLine && "mt-3",
        )}
      >
        <p className={cn(SECTION_LABEL_CLASS, "mb-2")}>Your staples</p>
        <div className="flex flex-wrap gap-1.5">
          {shownStaples.map((label, i) => (
            <span
              key={`${label}-${i}`}
              className="inline-block max-w-full truncate rounded-[100px] bg-[#F0EFED] px-3 py-1 text-[13px] text-[#1C1917]"
            >
              {label}
            </span>
          ))}
          {rest > 0 ? (
            <span className="inline-block rounded-[100px] bg-[#F0EFED] px-3 py-1 text-[13px] text-[#78716C]">
              +{rest} more
            </span>
          ) : null}
        </div>
      </button>

      <div className="my-3 h-px bg-[#F0EFED]" aria-hidden />

      <button
        type="button"
        onClick={onNavigateProfile}
        className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
      >
        <p className={cn(SECTION_LABEL_CLASS, "mb-2")}>Working toward</p>
        {aspirationName ? (
          <p className="text-[14px] italic text-[#78716C]">{aspirationName}</p>
        ) : (
          <span className="text-[14px] font-medium text-[#7C9E7A]">+ Add aspirations</span>
        )}
      </button>

      <button
        type="button"
        onClick={onNavigateProfile}
        className="mt-4 block w-full text-right text-[12px] text-[#78716C] hover:underline"
      >
        What Melu knows →
      </button>
    </div>
  );
}

function ThisWeekMealList({
  sortedMeals,
  tonightMeal,
  onViewPlan,
}: Readonly<{
  sortedMeals: Meal[];
  tonightMeal: Meal | undefined;
  onViewPlan: () => void;
}>) {
  return (
    <div className="mt-6">
      <div className={cn(SECTION_LABEL_CLASS, "mb-2")}>THIS WEEK</div>
      <ul className="divide-y divide-[#F0EFED]/80">
        {sortedMeals.map((m, i) => {
          const isTonight = m.day === tonightMeal?.day;
          return (
            <li
              key={`${m.day}-${m.name}-${i}`}
              className={cn(
                "flex min-h-[36px] items-center gap-2 py-1.5 pl-1",
                isTonight && "border-l-[3px] border-[#7C9E7A] pl-2 -ml-0.5",
              )}
            >
              <span className="w-9 shrink-0 text-[12px] text-[#78716C]">{dayToAbbrev(m.day)}</span>
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-[14px]",
                  isTonight ? "text-[#7C9E7A]" : "text-[#1C1917]",
                )}
              >
                {m.name}
              </span>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={onViewPlan}
        className="mt-3 block w-full text-left text-[13px] text-[#78716C]"
      >
        View full plan →
      </button>
    </div>
  );
}

type ApprovalToastPhase = "idle" | "fadeIn" | "visible" | "fadeOut";

function useApprovalToast(location: Location, navigate: NavigateFunction) {
  const [approvalToastPhase, setApprovalToastPhase] = useState<ApprovalToastPhase>("idle");

  useLayoutEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("approved") !== "true") return;
    navigate({ pathname: location.pathname, search: "" }, { replace: true });
    setApprovalToastPhase("fadeIn");
  }, [location.search, location.pathname, navigate]);

  useEffect(() => {
    if (approvalToastPhase !== "fadeIn") return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setApprovalToastPhase("visible");
      });
    });
    return () => cancelAnimationFrame(id);
  }, [approvalToastPhase]);

  useEffect(() => {
    if (approvalToastPhase !== "visible") return;
    const t = globalThis.setTimeout(() => setApprovalToastPhase("fadeOut"), 3000);
    return () => globalThis.clearTimeout(t);
  }, [approvalToastPhase]);

  useEffect(() => {
    if (approvalToastPhase !== "fadeOut") return;
    const t = globalThis.setTimeout(() => setApprovalToastPhase("idle"), 300);
    return () => globalThis.clearTimeout(t);
  }, [approvalToastPhase]);

  return {
    approvalToastPhase,
    showApprovalToast: approvalToastPhase !== "idle",
  };
}

function useWeeklyPlanFetch(setCurrentPlan: (p: Plan | null) => void) {
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const p = await fetchCurrentWeekPlan();
        if (cancelled) return;
        setCurrentPlan(p);
      } catch {
        // Keep existing store on fetch failure (offline / network).
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setCurrentPlan]);
}

function useHomeSessionProfile(
  setFirstName: (v: string) => void,
  setAvatarInitial: (v: string) => void,
) {
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!supabase) {
        setFirstName("there");
        setAvatarInitial("?");
        return;
      }
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user || cancelled) return;
      const { firstName: fn, initial } = firstNameFromSessionUser(user);
      setFirstName(fn);
      setAvatarInitial(initial);

      const cached = loadMealsPreviewCache();
      if (cached && cached.userId !== user.id) {
        clearMealsPreviewCache();
        clearChefCardCache();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setFirstName, setAvatarInitial]);
}

function collectStapleAndAspirationLabels(rows: unknown[] | null | undefined): {
  staples: string[];
  aspirations: string[];
} {
  const staples: string[] = [];
  const aspirations: string[] = [];
  for (const row of rows ?? []) {
    const r = row as {
      type?: string;
      meals?: { name?: string } | { name?: string }[] | null;
    };
    const mealsJoin = r.meals;
    const nameFromJoin = Array.isArray(mealsJoin) ? mealsJoin[0]?.name : mealsJoin?.name;
    const label =
      typeof nameFromJoin === "string" && nameFromJoin.trim() ? nameFromJoin : "Meal";
    if (r.type === "staple") staples.push(label);
    else if (r.type === "aspiration") aspirations.push(label);
  }
  return { staples, aspirations };
}

function firstAspirationDisplayName(
  aspirationLabels: string[],
  answers: OnboardingAnswers | null,
): string | null {
  if (aspirationLabels[0]) return aspirationLabels[0];
  const a = answers?.aspirations?.[0];
  if (!a) return null;
  return typeof a.name === "string" && a.name.trim() ? a.name.trim() : null;
}

function useMeluKnowsYouData() {
  const [familyLine, setFamilyLine] = useState<string | null>(null);
  const [stapleNames, setStapleNames] = useState<string[]>([]);
  const [aspirationName, setAspirationName] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!supabase) {
        setFamilyLine(null);
        setStapleNames([]);
        setAspirationName(null);
        return;
      }
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user || cancelled) return;

      const [profileRes, mealsRes] = await Promise.all([
        supabase.from("profiles").select("onboarding_answers").eq("user_id", user.id).maybeSingle(),
        supabase.from("user_meals").select("type, meals(name)").eq("user_id", user.id),
      ]);
      if (cancelled) return;

      const raw = profileRes.data?.onboarding_answers;
      const answers = raw === undefined || raw === null ? null : parseOnboardingAnswers(raw);
      const { staples, aspirations } = collectStapleAndAspirationLabels(mealsRes.data);

      setFamilyLine(buildFamilyWeeknightLine(answers));
      setStapleNames(staples);
      setAspirationName(firstAspirationDisplayName(aspirations, answers));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { familyLine, stapleNames, aspirationName };
}

function PlannedWeekBody({ plan, onViewPlan }: Readonly<{ plan: Plan; onViewPlan: () => void }>) {
  const meals = plan.meals;
  const todayJs = new Date().getDay();
  const tonightMeal = pickMealForAnchorDay(meals, todayJs);
  const sortedMeals = sortMealsMonThroughSun(meals);

  const tonightCard = tonightMeal ? <TonightHeroCard meal={tonightMeal} /> : null;

  const planIsApproved = effectivePlanStatus(plan) === "approved";

  const draftReviewCta = planIsApproved ? null : (
    <div className="mt-6">
      <button
        type="button"
        onClick={onViewPlan}
        className="w-full rounded-full bg-primary text-primary-foreground h-14 text-[16px] font-semibold"
      >
        Review and approve
      </button>
    </div>
  );

  return (
    <>
      {tonightCard}
      <ThisWeekMealList sortedMeals={sortedMeals} tonightMeal={tonightMeal} onViewPlan={onViewPlan} />
      {draftReviewCta}
      <p className="mt-5 mb-6 text-[13px] italic text-[#78716C]">
        Keeping cook time under 30 min every night this week.
      </p>
    </>
  );
}

export function HomeDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = useWeeklyPlanStore((s) => s.currentPlan);
  const setCurrentPlan = useWeeklyPlanStore((s) => s.setCurrentPlan);
  const hasPlan = Boolean(plan?.meals?.length);
  const planStatus = plan && hasPlan ? effectivePlanStatus(plan) : null;

  const { approvalToastPhase, showApprovalToast } = useApprovalToast(location, navigate);

  const [firstName, setFirstName] = useState("there");
  const [avatarInitial, setAvatarInitial] = useState("?");

  useWeeklyPlanFetch(setCurrentPlan);
  useHomeSessionProfile(setFirstName, setAvatarInitial);
  const { familyLine, stapleNames, aspirationName } = useMeluKnowsYouData();

  const goToProfile = () => navigate("/profile");

  const avatarButton = (
    <button type="button" onClick={() => navigate("/profile")} aria-label="Profile">
      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
        <span className="text-primary-foreground text-[14px] font-semibold">{avatarInitial}</span>
      </div>
    </button>
  );

  const greeting = (
    <div className="mt-6 mb-6 md:mt-0">
      <h1 className="text-[18px] text-foreground mb-1 font-semibold">
        {getWeekdayGreeting()}, {firstName}.
      </h1>
      <p className="text-[15px] text-muted-foreground font-normal">
        {greetingSubtitle(hasPlan, planStatus)}
      </p>
    </div>
  );

  const goToPlan = () => navigate("/plan");

  const stateAEmptyWeek = (
    <div>
      <div className={cn(SECTION_LABEL_CLASS, "mb-2")}>THIS WEEK</div>
      <div className="rounded-2xl bg-card p-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-border/60">
        <p className="text-[15px] text-[#78716C] mb-4">No plan yet this week.</p>
        <button
          type="button"
          onClick={() => navigate("/weekly-checkin")}
          className="w-full rounded-full bg-primary text-primary-foreground h-14 text-[16px] font-semibold"
        >
          Plan this week&apos;s dinners
        </button>
        <p className="text-center text-[12px] text-[#78716C] mt-3">Takes about 60 seconds.</p>
      </div>
    </div>
  );

  const mainColumn =
    hasPlan && plan ? (
      <PlannedWeekBody plan={plan} onViewPlan={goToPlan} />
    ) : (
      stateAEmptyWeek
    );

  return (
    <ScreenShell className="pb-[76px] md:pb-0 md:max-w-none md:w-full md:px-10">
      {showApprovalToast ? (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "fixed left-1/2 z-[100] max-w-[320px] w-fit -translate-x-1/2 rounded-[9999px] px-5 py-3 text-[14px] font-medium text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-opacity",
            "bottom-6",
            approvalToastPhase === "fadeIn" && "opacity-0 duration-200",
            approvalToastPhase === "visible" && "opacity-100 duration-200",
            approvalToastPhase === "fadeOut" && "opacity-0 duration-300",
          )}
          style={{ backgroundColor: "#1C1917" }}
        >
          Plan approved. Your week is set.
        </div>
      ) : null}

      <div className="md:hidden">
        <TopBar right={avatarButton} />
      </div>

      <nav
        className="hidden md:flex items-center justify-between px-6 py-4 border-b border-border"
        aria-label="Main"
      >
        <div className="text-[22px] text-primary font-semibold">melu</div>
        <div className="flex items-center gap-8">
          <span className="text-[15px] font-medium text-primary">This Week</span>
          <button
            type="button"
            onClick={() => navigate("/coming-up")}
            className="text-[15px] font-normal text-muted-foreground hover:text-foreground"
          >
            Coming Up
          </button>
        </div>
        {avatarButton}
      </nav>

      <div className="w-full md:max-w-[1100px] md:mx-auto">
        {greeting}

        <div className="flex flex-col md:flex-row md:items-start md:gap-8">
          <div className="w-full min-w-0 md:w-[60%]">{mainColumn}</div>

          <div className="hidden min-w-0 md:block md:w-[40%]">
            <MeluKnowsYouDesktopCard
              familyLine={familyLine}
              stapleNames={stapleNames}
              aspirationName={aspirationName}
              onNavigateProfile={goToProfile}
            />
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <BottomNav activeTab="this-week" />
      </div>
    </ScreenShell>
  );
}
