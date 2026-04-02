import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { BottomNav } from "../components/BottomNav";
import { MeluCard, ScreenShell, TopBar } from "../components/design-system";
import { cn } from "../components/ui/utils";
import type { Meal, Plan } from "../lib/api";
import { fetchMealsPreview } from "../lib/api";
import {
  clearMealsPreviewCache,
  loadMealsPreviewCache,
  saveMealsPreviewCache,
} from "../lib/mealsPreviewCache";
import { supabase } from "../lib/supabase";
import { useWeeklyPlanStore } from "../stores/weeklyPlanStore";

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

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function mealSourceType(m: Meal): "staple" | "aspiration" | undefined {
  const raw = (m as { source_type?: string }).source_type ?? m.sourceType;
  if (raw === "staple" || raw === "aspiration") return raw;
  return undefined;
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

function PillRow({
  labels,
  variant,
}: {
  labels: string[];
  variant: "staple" | "aspiration";
}) {
  const shown = labels.slice(0, 3);
  const rest = labels.length - 3;
  const base =
    "inline-block rounded-full text-[11px] m-0.5 px-2.5 py-0.5 max-w-full truncate";
  const style =
    variant === "staple"
      ? "border border-primary text-primary"
      : "border border-dashed border-muted-foreground text-muted-foreground";

  return (
    <div>
      <div className="flex flex-wrap">
        {shown.map((label) => (
          <span key={label} className={cn(base, style)}>
            {label}
          </span>
        ))}
      </div>
      {rest > 0 ? (
        <p className="text-[11px] text-muted-foreground mt-1">+ {rest} more</p>
      ) : null}
    </div>
  );
}

function SourceTag({ kind }: { kind: "staple" | "aspiration" }) {
  const label = kind === "aspiration" ? "Aspiration" : "Staple";
  return (
    <span
      className="shrink-0 ml-2 inline-block rounded-[10px] px-2 py-0.5 text-[10px] font-normal text-primary bg-[#EBF2EB]"
    >
      {label}
    </span>
  );
}

function WeekPlanCard({
  plan,
  onViewFullPlan,
}: {
  plan: Plan;
  onViewFullPlan: () => void;
}) {
  const meals = plan.meals;

  return (
    <MeluCard>
      {meals.map((meal, index) => {
        const src = mealSourceType(meal);
        return (
          <div key={`${meal.day}-${meal.name}-${index}`}>
            <div className="flex items-center justify-between gap-2 py-2">
              <span className="text-[12px] text-muted-foreground font-normal shrink-0">
                {dayToAbbrev(meal.day)}
              </span>
              <div className="flex flex-1 min-w-0 items-center justify-end gap-1 flex-wrap">
                <span className="text-[15px] text-foreground text-right font-normal">
                  {meal.name}
                </span>
                {src === "aspiration" ? <SourceTag kind="aspiration" /> : null}
                {src === "staple" ? <SourceTag kind="staple" /> : null}
              </div>
            </div>
            {index < meals.length - 1 ? (
              <div className="border-t border-border-subtle" />
            ) : null}
          </div>
        );
      })}
      <div className="mt-3 text-right">
        <button
          type="button"
          onClick={onViewFullPlan}
          className="text-[13px] text-primary font-normal"
        >
          View full plan →
        </button>
      </div>
    </MeluCard>
  );
}

function MeluKnowsYouBlock({
  stapleNames,
  aspirationNames,
  onProfile,
}: {
  stapleNames: string[];
  aspirationNames: string[];
  onProfile: () => void;
}) {
  const showStaples = stapleNames.length > 0;
  const showAspiration = aspirationNames.length > 0;
  if (!showStaples && !showAspiration) return null;

  return (
    <div>
      <div className="text-[11px] text-muted-foreground tracking-[0.08em] font-semibold mb-2 md:mb-2">
        MELU KNOWS YOU
      </div>
      <div
        className={cn(
          "grid gap-3 md:grid-cols-1 md:gap-3",
          showStaples && showAspiration ? "grid-cols-2" : "grid-cols-1",
        )}
      >
        {showStaples ? (
          <div className="rounded-xl bg-card p-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)] md:w-full">
            <h3 className="text-[10px] font-semibold tracking-[0.07em] text-muted-foreground mb-2">
              YOUR STAPLES
            </h3>
            <PillRow labels={stapleNames} variant="staple" />
            <p className="text-[11px] text-muted-foreground mt-2">Anchors every plan.</p>
          </div>
        ) : null}
        {showAspiration ? (
          <div className="rounded-xl bg-card p-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)] md:w-full">
            <h3 className="text-[10px] font-semibold tracking-[0.07em] text-muted-foreground mb-2">
              YOUR ASPIRATIONS
            </h3>
            <PillRow labels={aspirationNames} variant="aspiration" />
            <p className="text-[11px] text-muted-foreground mt-2">
              Introduced at your pace.
            </p>
          </div>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onProfile}
        className="block w-full text-right text-[13px] text-primary font-normal mt-3"
      >
        See your full profile →
      </button>
    </div>
  );
}

function readInitialPreview(): { staples: string[]; aspirations: string[] } {
  const cached = loadMealsPreviewCache();
  if (!cached) return { staples: [], aspirations: [] };
  return {
    staples: cached.topStapleMeals,
    aspirations: cached.topAspirations,
  };
}

export function HomeDashboard() {
  const navigate = useNavigate();
  const plan = useWeeklyPlanStore((s) => s.currentPlan);
  const hasPlan = Boolean(plan?.meals?.length);

  const [firstName, setFirstName] = useState("there");
  const [avatarInitial, setAvatarInitial] = useState("?");
  const [mealPreviewNames, setMealPreviewNames] = useState(() => readInitialPreview());
  const stapleNames = mealPreviewNames.staples;
  const aspirationNames = mealPreviewNames.aspirations;

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
        setMealPreviewNames({ staples: [], aspirations: [] });
      }

      try {
        const preview = await fetchMealsPreview();
        if (cancelled) return;
        const staples = preview.topStapleMeals ?? [];
        const aspirations = preview.topAspirations ?? [];
        setMealPreviewNames({ staples, aspirations });
        saveMealsPreviewCache({
          userId: user.id,
          topStapleMeals: staples,
          topAspirations: aspirations,
        });
      } catch {
        if (!cancelled) {
          setMealPreviewNames({ staples: [], aspirations: [] });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const showMeluKnowsYou = stapleNames.length > 0 || aspirationNames.length > 0;

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
        {getGreeting()}, {firstName}.
      </h1>
      <p className="text-[15px] text-muted-foreground font-normal">
        {hasPlan
          ? "This week's plan is set."
          : "Melu knows your family. Time to plan this week."}
      </p>
    </div>
  );

  const weekSectionLabel = (
    <div className="text-[11px] text-muted-foreground tracking-[0.08em] font-semibold mb-2">
      THIS WEEK
    </div>
  );

  const thisWeekCard = hasPlan && plan ? (
    <div>
      {weekSectionLabel}
      <WeekPlanCard plan={plan} onViewFullPlan={() => navigate("/plan")} />
    </div>
  ) : (
    <div>
      {weekSectionLabel}
      <div className="rounded-2xl bg-card p-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-border/60">
        <p className="text-[15px] text-muted-foreground mb-4">No plan yet this week.</p>
        <button
          type="button"
          onClick={() => navigate("/weekly-checkin")}
          className="w-full rounded-full bg-primary text-primary-foreground h-14 text-[17px] font-semibold"
        >
          Plan this week&apos;s dinners
        </button>
        <p className="text-center text-[12px] text-muted-foreground mt-2">Takes about 60 seconds.</p>
      </div>
    </div>
  );

  const nudge = hasPlan ? (
    <p className="text-[13px] text-muted-foreground font-normal text-center md:text-left">
      Next plan generates Sunday.
    </p>
  ) : null;

  const meluBlock =
    showMeluKnowsYou ? (
      <MeluKnowsYouBlock
        stapleNames={stapleNames}
        aspirationNames={aspirationNames}
        onProfile={() => navigate("/profile")}
      />
    ) : null;

  return (
    <ScreenShell className="pb-[76px] md:pb-0 md:max-w-none md:w-full">
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

      <div
        className={cn(
          "grid grid-cols-1 md:gap-0",
          showMeluKnowsYou ? "md:grid-cols-2" : "md:grid-cols-1",
        )}
      >
        <div className="order-1 md:order-none md:col-start-1 md:row-start-1 md:px-6 md:pt-6 md:border-r md:border-border">
          {greeting}
        </div>
        <div className="order-2 md:order-none md:col-start-1 md:row-start-2 md:px-6 md:pb-4 md:border-r md:border-border">
          {thisWeekCard}
        </div>
        {showMeluKnowsYou ? (
          <div
            className={cn(
              "order-3 mt-5 md:mt-0 md:order-none md:col-start-2 md:row-start-1 md:px-6 md:py-6",
              hasPlan ? "md:row-span-3" : "md:row-span-2",
            )}
          >
            {meluBlock}
          </div>
        ) : null}
        {hasPlan ? (
          <div className="order-4 mt-4 md:mt-0 md:order-none md:col-start-1 md:row-start-3 md:px-6 md:pb-6 md:border-r md:border-border">
            {nudge}
          </div>
        ) : null}
      </div>

      <div className="md:hidden">
        <BottomNav activeTab="this-week" />
      </div>
    </ScreenShell>
  );
}
