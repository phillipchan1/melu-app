import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { BottomNav } from "../components/BottomNav";
import { ScreenShell, TopBar, WeekSummaryCard } from "../components/design-system";
import type { Plan } from "../lib/api";
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

function firstNameFromSessionUser(user: {
  user_metadata?: Record<string, unknown>;
  email?: string;
}): { initial: string } {
  const full = user.user_metadata?.full_name;
  const emailLocal = user.email?.split("@")[0] ?? "";
  const raw =
    typeof full === "string" && full.trim().length > 0 ? full.trim() : emailLocal || "there";
  const first = raw.split(/\s+/)[0] ?? raw;
  const initial = first.charAt(0).toUpperCase() || "?";
  return { initial };
}

function planToWeekSummaryItems(plan: Plan) {
  return plan.meals.map((m) => ({
    day: dayToAbbrev(m.day),
    meal: m.name,
  }));
}

export function ComingUp() {
  const navigate = useNavigate();
  const nextPlan = useWeeklyPlanStore((s) => s.nextPlan);
  const hasNextPlan = Boolean(nextPlan?.meals?.length);

  const [avatarInitial, setAvatarInitial] = useState("?");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!supabase) {
        setAvatarInitial("?");
        return;
      }
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user || cancelled) return;
      const { initial } = firstNameFromSessionUser(user);
      setAvatarInitial(initial);
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

  const shellTop = (
    <>
      <div className="md:hidden">
        <TopBar right={avatarButton} />
      </div>
      <nav
        className="hidden md:flex items-center justify-between px-6 py-4 border-b border-border"
        aria-label="Main"
      >
        <div className="text-[22px] text-primary font-semibold">melu</div>
        <div className="flex items-center gap-8">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="text-[15px] font-normal text-muted-foreground hover:text-foreground"
          >
            This Week
          </button>
          <span className="text-[15px] font-medium text-primary">Coming Up</span>
        </div>
        {avatarButton}
      </nav>
    </>
  );

  if (!hasNextPlan || !nextPlan) {
    return (
      <ScreenShell className="pb-[76px] md:pb-0 md:max-w-none md:w-full bg-background min-h-[100dvh] flex flex-col">
        {shellTop}
        <div className="flex flex-1 flex-col items-center justify-center px-page py-8 md:py-12">
          <div className="w-full max-w-[280px] text-center">
            <div className="text-[11px] text-muted-foreground tracking-[0.08em] font-semibold">
              NEXT WEEK
            </div>
            <div className="h-3" aria-hidden />
            <h1 className="text-[20px] text-foreground font-semibold">
              Your next plan isn&apos;t ready yet.
            </h1>
            <div className="h-3" aria-hidden />
            <p className="text-[15px] text-muted-foreground font-normal leading-[1.5]">
              Melu builds it every Sunday morning. Want it now?
            </p>
            <div className="h-8" aria-hidden />
            <button
              type="button"
              onClick={() => navigate("/weekly-checkin")}
              className="w-full max-w-[280px] mx-auto block rounded-full bg-primary text-primary-foreground h-[52px] text-[17px] font-semibold px-5"
            >
              Build next week&apos;s plan now
            </button>
            <div className="h-4" aria-hidden />
            <p className="text-[13px] text-muted-foreground font-normal">
              Melu will use your profile and this week&apos;s approvals.
            </p>
          </div>
        </div>
        <div className="md:hidden">
          <BottomNav activeTab="coming-up" />
        </div>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell className="pb-[76px] md:pb-0 md:max-w-none md:w-full bg-background">
      {shellTop}
      <div className="px-page md:px-6 md:py-6 md:max-w-2xl md:mx-auto">
        <div className="mt-6 mb-6 md:mt-0">
          <h1 className="text-[18px] text-foreground mb-1 font-semibold">Next week is sorted.</h1>
          <p className="text-[15px] text-muted-foreground font-normal">
            Your plan is ready to review.
          </p>
        </div>
        <div className="space-y-2">
          <div className="text-[11px] text-muted-foreground tracking-[0.08em] font-semibold">
            NEXT WEEK
          </div>
          <WeekSummaryCard
            items={planToWeekSummaryItems(nextPlan)}
            footer={
              <button
                type="button"
                onClick={() => navigate("/plan", { state: { plan: nextPlan } })}
                className="text-[13px] text-primary font-normal"
              >
                Approve when ready →
              </button>
            }
          />
        </div>
      </div>
      <div className="md:hidden">
        <BottomNav activeTab="coming-up" />
      </div>
    </ScreenShell>
  );
}
