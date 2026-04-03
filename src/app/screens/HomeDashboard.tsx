import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";

import { BottomNav } from "../components/BottomNav";
import { ScreenShell, TopBar } from "../components/design-system";
import { cn } from "../components/ui/utils";
import type { Plan, PlanStatus } from "../lib/api";
import { fetchCurrentWeekPlan } from "../lib/api";
import { clearChefCardCache } from "../lib/chefCardCache";
import { clearMealsPreviewCache, loadMealsPreviewCache } from "../lib/mealsPreviewCache";
import { supabase } from "../lib/supabase";
import { useWeeklyPlanStore } from "../stores/weeklyPlanStore";

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

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

const MELU_SECTION_LABEL = "text-[10px] font-semibold tracking-[0.08em] text-[#78716C] mb-2";

function StaplePillsRow({ labels }: { labels: string[] }) {
  const shown = labels.slice(0, 3);
  const rest = Math.max(0, labels.length - 3);
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {shown.map((label, i) => (
          <span
            key={`${label}-${i}`}
            className="inline-block max-w-full truncate rounded-full border border-solid border-[#7C9E7A] bg-white px-3 py-1 text-[12px] font-medium text-[#7C9E7A]"
          >
            {label}
          </span>
        ))}
      </div>
      {rest > 0 ? (
        <p className="mt-1 text-[12px] text-[#78716C]">+{rest} more</p>
      ) : null}
    </div>
  );
}

function AspirationPillsRow({ labels }: { labels: string[] }) {
  const shown = labels.slice(0, 3);
  const rest = Math.max(0, labels.length - 3);
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {shown.map((label, i) => (
          <span
            key={`${label}-${i}`}
            className="inline-block max-w-full truncate rounded-full border-[1.5px] border-dashed border-[#78716C] bg-white px-3 py-1 text-[12px] font-medium text-[#78716C]"
          >
            {label}
          </span>
        ))}
      </div>
      {rest > 0 ? (
        <p className="mt-1 text-[12px] text-[#78716C]">+{rest} more</p>
      ) : null}
    </div>
  );
}

/** State C — approved plan (active week). */
function ThisWeekSummaryCard({ plan, onNavigatePlan }: { plan: Plan; onNavigatePlan: () => void }) {
  const meals = plan.meals;
  const shown = meals.slice(0, 3);
  const rest = Math.max(0, meals.length - 3);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onNavigatePlan}
        className="w-full text-left rounded-2xl bg-card p-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-border/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-[13px] font-medium text-foreground">This week</span>
          <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-[#EBF2EB] text-[#2D572C]">
            Approved
          </span>
        </div>
        <ul className="space-y-1.5 mb-1">
          {shown.map((m, i) => (
            <li key={`${m.day}-${m.name}-${i}`} className="text-[15px] text-foreground truncate">
              {m.name}
            </li>
          ))}
        </ul>
        {rest > 0 ? (
          <p className="text-[13px] text-muted-foreground">+{rest} more</p>
        ) : null}
        <p className="text-[13px] text-primary font-normal mt-3 text-right">View full plan →</p>
      </button>
    </div>
  );
}

/** State B — draft plan, not yet approved. */
function DraftWeekSummaryCard({ plan, onReview }: { plan: Plan; onReview: () => void }) {
  const rows = plan.meals.slice(0, 5);
  const rest = Math.max(0, plan.meals.length - 5);

  return (
    <div className="rounded-2xl bg-card p-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-border/60 space-y-4">
      <p className="text-[11px] font-semibold tracking-[0.08em] text-[#78716C]">READY TO REVIEW</p>
      <ul className="space-y-1.5">
        {rows.map((m, i) => (
          <li key={`${m.day}-${m.name}-${i}`} className="text-[15px] text-foreground truncate">
            {m.day} · {m.name}
          </li>
        ))}
      </ul>
      {rest > 0 ? (
        <p className="text-[13px] text-muted-foreground">+{rest} more</p>
      ) : null}
      <button
        type="button"
        onClick={onReview}
        className="w-full rounded-full bg-primary text-primary-foreground h-14 text-[16px] font-semibold"
      >
        Review and approve
      </button>
    </div>
  );
}

function GroceryShortcutCard({ onNavigate }: { onNavigate: () => void }) {
  return (
    <button
      type="button"
      onClick={onNavigate}
      className="w-full rounded-2xl bg-card p-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-border/60 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <span className="text-[15px] font-medium text-foreground">View grocery list</span>
      <p className="text-[13px] text-muted-foreground mt-1">Ingredients for this week →</p>
    </button>
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
  const hasStaples = stapleNames.length > 0;
  const hasAspirations = aspirationNames.length > 0;
  const showOuterCard = hasStaples || hasAspirations;

  return (
    <div className="flex h-full min-h-0 flex-col md:flex-1 md:self-stretch">
      <div className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground mb-2">
        MELU KNOWS YOU
      </div>

      {showOuterCard ? (
        <div
          className={cn(
            "flex flex-1 flex-col rounded-xl border border-border/60 bg-card p-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)]",
            "min-h-0 md:min-h-full",
          )}
        >
          <div className="flex min-h-0 flex-1 flex-col">
            {hasStaples ? (
              <div>
                <h3 className={MELU_SECTION_LABEL}>YOUR STAPLES</h3>
                <StaplePillsRow labels={stapleNames} />
                <p className="mt-2 text-[12px] text-[#78716C]">Anchors every plan.</p>
              </div>
            ) : null}

            {hasStaples ? <div className="my-3 h-px shrink-0 bg-[#F0EFED]" aria-hidden /> : null}

            <div className={cn(hasStaples ? "" : "flex-1")}>
              <h3 className={MELU_SECTION_LABEL}>YOUR ASPIRATIONS</h3>
              {hasAspirations ? (
                <>
                  <AspirationPillsRow labels={aspirationNames} />
                  <p className="mt-2 text-[12px] text-[#78716C]">Introduced at your pace.</p>
                </>
              ) : (
                <>
                  <p className="text-[12px] text-[#78716C]">No aspirations yet.</p>
                  <button
                    type="button"
                    onClick={onProfile}
                    className="mt-2 text-left text-[13px] font-medium text-[#7C9E7A]"
                  >
                    + Add aspirations
                  </button>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onProfile}
            className="mt-4 block w-full text-right text-[13px] font-normal text-primary"
          >
            What Melu knows →
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onProfile}
          className="block w-full text-right text-[13px] font-normal text-primary md:mt-auto"
        >
          What Melu knows →
        </button>
      )}
    </div>
  );
}

type ApprovalToastPhase = "idle" | "fadeIn" | "visible" | "fadeOut";

export function HomeDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = useWeeklyPlanStore((s) => s.currentPlan);
  const setCurrentPlan = useWeeklyPlanStore((s) => s.setCurrentPlan);
  const hasPlan = Boolean(plan?.meals?.length);
  const planStatus = plan && hasPlan ? effectivePlanStatus(plan) : null;

  const [approvalToastPhase, setApprovalToastPhase] = useState<ApprovalToastPhase>("idle");

  const [firstName, setFirstName] = useState("there");
  const [avatarInitial, setAvatarInitial] = useState("?");
  const [meluStapleNames, setMeluStapleNames] = useState<string[]>([]);
  const [meluAspirationNames, setMeluAspirationNames] = useState<string[]>([]);

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

      try {
        const { data: mealRows, error: mealsErr } = await supabase
          .from("user_meals")
          .select("type, meals(name)")
          .eq("user_id", user.id);
        if (cancelled) return;
        if (mealsErr) {
          setMeluStapleNames([]);
          setMeluAspirationNames([]);
        } else {
          const staples: string[] = [];
          const aspirations: string[] = [];
          for (const row of mealRows ?? []) {
            const r = row as {
              type?: string;
              meals?: { name?: string } | { name?: string }[] | null;
            };
            const meals = r.meals;
            const nameFromJoin = Array.isArray(meals) ? meals[0]?.name : meals?.name;
            const label =
              typeof nameFromJoin === "string" && nameFromJoin.trim() ? nameFromJoin : "Meal";
            if (r.type === "staple") staples.push(label);
            else if (r.type === "aspiration") aspirations.push(label);
          }
          setMeluStapleNames(staples);
          setMeluAspirationNames(aspirations);
        }
      } catch {
        if (!cancelled) {
          setMeluStapleNames([]);
          setMeluAspirationNames([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

  const weekSectionLabel = (
    <div className="text-[11px] text-muted-foreground tracking-[0.08em] font-semibold mb-2">
      THIS WEEK
    </div>
  );

  const goToPlan = () => navigate("/plan");

  const stateAEmptyWeek = (
    <div>
      {weekSectionLabel}
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

  let thisWeekCard: ReactNode;
  if (!hasPlan || !plan) {
    thisWeekCard = stateAEmptyWeek;
  } else if (effectivePlanStatus(plan) === "approved") {
    thisWeekCard = (
      <div>
        {weekSectionLabel}
        <ThisWeekSummaryCard plan={plan} onNavigatePlan={goToPlan} />
        <div className="mt-3">
          <GroceryShortcutCard onNavigate={() => navigate("/grocery")} />
        </div>
      </div>
    );
  } else {
    thisWeekCard = (
      <div>
        {weekSectionLabel}
        <DraftWeekSummaryCard plan={plan} onReview={goToPlan} />
      </div>
    );
  }

  const nudge = hasPlan ? (
    <p className="text-[13px] text-muted-foreground font-normal text-center md:text-left">
      Next plan drops Sunday.
    </p>
  ) : null;

  const meluBlock = (
    <MeluKnowsYouBlock
      stapleNames={meluStapleNames}
      aspirationNames={meluAspirationNames}
      onProfile={() => navigate("/profile")}
    />
  );

  const showApprovalToast = approvalToastPhase !== "idle";

  return (
    <ScreenShell className="pb-[76px] md:pb-0 md:max-w-none md:w-full">
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

      <div className="grid grid-cols-1 md:grid-cols-2 md:items-stretch md:gap-0">
        <div className="order-1 md:order-none md:col-start-1 md:row-start-1 md:px-6 md:pt-6 md:border-r md:border-border">
          {greeting}
        </div>
        <div className="order-2 md:order-none md:col-start-1 md:row-start-2 md:px-6 md:pb-4 md:border-r md:border-border">
          {thisWeekCard}
        </div>
        <div
          className={cn(
            "order-3 mt-5 md:mt-0 md:order-none md:col-start-2 md:row-start-1 md:flex md:flex-col md:px-6 md:py-6",
            hasPlan ? "md:row-span-3" : "md:row-span-2",
          )}
        >
          {meluBlock}
        </div>
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
