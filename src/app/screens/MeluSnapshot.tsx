import { ChevronLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Button, buttonVariants } from "../components/ui/button";
import type { OnboardingAnswers, Staple } from "../lib/api";
import { resetProfile } from "../lib/api";
import { clearChefCardCache } from "../lib/chefCardCache";
import { clearOnboardingDraft } from "../lib/onboardingDraft";
import { clearMealsPreviewCache } from "../lib/mealsPreviewCache";
import { useOnboardingChefCardStore } from "../stores/onboardingChefCardStore";
import { useWeeklyPlanStore } from "../stores/weeklyPlanStore";
import {
  STILL_LEARNING_ITEMS,
  buildFamilySummary,
  cookTimeDetailLabel,
  discoveryPaceLabel,
  formatAvoidDetails,
  formatFamilyDetailsRow,
  parseOnboardingAnswers,
} from "../lib/meluSnapshotCopy";
import { supabase } from "../lib/supabase";

const SECTION_LABEL = "text-[10px] font-semibold tracking-[0.08em] text-[#78716C] mb-2";
const SUBTEXT = "text-[12px] text-[#78716C] mb-3";

type UserMealChip = {
  id: string;
  type: "staple" | "aspiration";
  label: string;
  /** True when shown from saved onboarding answers only (no user_meals row yet). */
  readonly answerFallback?: boolean;
};

type MeluSnapshotProps = {
  readonly mode: "onboarding" | "profile";
};

export function MeluSnapshot({ mode }: Readonly<MeluSnapshotProps>) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<OnboardingAnswers | null>(null);
  const [staples, setStaples] = useState<UserMealChip[]>([]);
  const [aspirations, setAspirations] = useState<UserMealChip[]>([]);
  const [approvedPlanCount, setApprovedPlanCount] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      setAnswers(null);
      setStaples([]);
      setAspirations([]);
      setApprovedPlanCount(null);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    if (!user) {
      setLoading(false);
      return;
    }

    const userId = user.id;

    const [profileRes, mealsRes] = await Promise.all([
      supabase.from("profiles").select("onboarding_answers").eq("user_id", userId).maybeSingle(),
      supabase.from("user_meals").select("id, type, meal_id, meals(name)").eq("user_id", userId),
    ]);

    let approvedCount: number | null = null;
    if (mode === "profile") {
      const { count, error: countErr } = await supabase
        .from("meal_plans")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "approved");
      if (!countErr) {
        approvedCount = count ?? 0;
      }
    }

    const raw = profileRes.data?.onboarding_answers;
    const parsed = raw === undefined || raw === null ? null : parseOnboardingAnswers(raw);
    setAnswers(parsed);

    const mealRows = mealsRes.data ?? [];
    const chips: UserMealChip[] = mealRows.map((row: Record<string, unknown>) => {
      const rawId = row.id;
      const id = typeof rawId === "string" ? rawId : String(rawId ?? "");
      const t = String(row.type ?? "").toLowerCase() === "aspiration" ? "aspiration" : "staple";
      const meals = row.meals as { name?: string } | { name?: string }[] | null | undefined;
      const nameFromJoin = Array.isArray(meals) ? meals[0]?.name : meals?.name;
      const label = typeof nameFromJoin === "string" && nameFromJoin.trim() ? nameFromJoin : "Meal";
      return { id, type: t, label };
    });
    setStaples(chips.filter((c) => c.type === "staple"));
    let aspirationChips = chips.filter((c) => c.type === "aspiration");
    if (aspirationChips.length === 0 && parsed?.aspirations?.length) {
      aspirationChips = (parsed.aspirations as Staple[]).map((a, i) => ({
        id: `oa:${i}:${String(a.id)}`,
        type: "aspiration" as const,
        label: typeof a.name === "string" && a.name.trim() ? a.name.trim() : "Meal",
        answerFallback: true,
      }));
    }
    setAspirations(aspirationChips);

    setApprovedPlanCount(approvedCount);

    setLoading(false);
  }, [mode]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleRemoveMeal = async (id: string) => {
    if (!supabase || mode !== "profile") return;
    if (id.startsWith("oa:")) return;
    setRemovingId(id);
    try {
      const { error } = await supabase.from("user_meals").delete().eq("id", id);
      if (error) {
        console.error("Remove user_meal failed", error);
        return;
      }
      setStaples((prev) => prev.filter((r) => r.id !== id));
      setAspirations((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setRemovingId(null);
    }
  };

  const addStaple = () => {
    navigate("/onboarding/staples?mode=edit");
  };

  const addAspiration = () => {
    navigate("/onboarding/aspirations?mode=edit");
  };

  const handleConfirmReset = () => {
    void (async () => {
      setResetError(null);
      setResetting(true);
      try {
        await resetProfile();
        clearMealsPreviewCache();
        clearChefCardCache();
        clearOnboardingDraft();
        useWeeklyPlanStore.getState().setCurrentPlan(null);
        useWeeklyPlanStore.getState().setNextPlan(null);
        useWeeklyPlanStore.getState().setLastPlanRequest(null);
        useOnboardingChefCardStore.getState().reset();
        setShowResetConfirm(false);
        navigate("/onboarding", { replace: true });
      } catch (err) {
        setResetError(err instanceof Error ? err.message : "Reset failed");
      } finally {
        setResetting(false);
      }
    })();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-page">
        <p className="text-[14px] text-[#78716C]">Loading...</p>
      </div>
    );
  }

  const summaryText =
    answers === null ? "Melu is still getting to know your family." : buildFamilySummary(answers);

  const showFamilyDetails = mode === "profile" && answers != null;

  return (
    <div className="min-h-screen bg-background">
      {mode === "profile" ? (
        <header className="relative flex items-center justify-center px-4 py-4 border-b border-border/50">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-1 text-[#1C1917]"
            aria-label="Back"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2} />
          </button>
          <h1 className="text-[17px] font-semibold text-[#1C1917]">What Melu Knows</h1>
        </header>
      ) : null}

      <div className="max-w-[900px] mx-auto px-10 md:px-12 pb-12 pt-6 md:pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 gap-8">
          {/* Left column */}
          <div className="flex flex-col gap-8">
            <section>
              <p className="text-[15px] text-[#1C1917] leading-[1.6] mb-5">{summaryText}</p>
            </section>

            <section>
              <p className={SECTION_LABEL}>YOUR STAPLES</p>
              <p className={SUBTEXT}>These anchor every plan.</p>
              {staples.length === 0 ? (
                <p className="text-[13px] text-[#78716C]">
                  No staples yet — you&apos;ll add these during setup.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {staples.map((row) => (
                    <span
                      key={row.id}
                      className="inline-flex items-center rounded-full border-[1.5px] border-solid border-[#7C9E7A] bg-white px-3.5 py-1.5 text-[13px] font-medium text-[#7C9E7A]"
                    >
                      {row.label}
                      {mode === "profile" ? (
                        <button
                          type="button"
                          className="ml-1.5 text-[12px] text-[#78716C] leading-none disabled:opacity-50"
                          disabled={removingId === row.id}
                          onClick={() => void handleRemoveMeal(row.id)}
                          aria-label={`Remove ${row.label}`}
                        >
                          ×
                        </button>
                      ) : null}
                    </span>
                  ))}
                </div>
              )}
              {mode === "profile" ? (
                <button
                  type="button"
                  onClick={addStaple}
                  className="mt-3 text-[13px] text-[#7C9E7A] font-medium cursor-pointer text-left"
                >
                  + Add a staple
                </button>
              ) : null}
            </section>

            <section>
              <p className={SECTION_LABEL}>YOUR ASPIRATIONS</p>
              <p className={SUBTEXT}>Meals Melu will work toward, one dish at a time.</p>
              {aspirations.length === 0 ? (
                <p className="text-[13px] text-[#78716C]">No aspirations yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {aspirations.map((row) => (
                    <span
                      key={row.id}
                      className="inline-flex items-center rounded-full border-[1.5px] border-dashed border-[#78716C] bg-white px-3.5 py-1.5 text-[13px] font-medium text-[#78716C]"
                    >
                      {row.label}
                      {mode === "profile" && !row.answerFallback ? (
                        <button
                          type="button"
                          className="ml-1.5 text-[12px] text-[#78716C] leading-none disabled:opacity-50"
                          disabled={removingId === row.id}
                          onClick={() => void handleRemoveMeal(row.id)}
                          aria-label={`Remove ${row.label}`}
                        >
                          ×
                        </button>
                      ) : null}
                    </span>
                  ))}
                </div>
              )}
              {mode === "profile" ? (
                <button
                  type="button"
                  onClick={addAspiration}
                  className="mt-3 text-[13px] text-[#7C9E7A] font-medium cursor-pointer text-left"
                >
                  + Add aspirations
                </button>
              ) : null}
            </section>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-8">
            {mode === "onboarding" ? (
              <section>
                <h2 className="text-[15px] font-semibold text-[#1C1917] mb-4">
                  Melu is still learning:
                </h2>
                <ul className="space-y-3">
                  {STILL_LEARNING_ITEMS.map((text) => (
                    <li key={text} className="flex items-start gap-2.5">
                      <span
                        className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full border-[1.5px] border-solid border-[#D6D3CF] bg-transparent"
                        aria-hidden
                      />
                      <span className="text-[14px] text-[#78716C]/75">{text}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[13px] text-[#78716C] italic leading-[1.6]">
                  I know enough to build a solid first plan. The more you approve and adjust, the
                  better I&apos;ll know your family.
                </p>
              </section>
            ) : (
              <>
                <section>
                  <p className={SECTION_LABEL}>WHAT MELU HAS NOTICED</p>
                  {(approvedPlanCount ?? 0) < 3 ? (
                    <p className="text-[13px] text-[#78716C] leading-[1.6]">
                      Melu is still building a picture of your family&apos;s patterns. Approve a few
                      more plans and check back.
                    </p>
                  ) : (
                    <p className="text-[13px] text-[#78716C] leading-[1.6]">
                      {/* TODO Sprint 3: generate behavioral observations from approval history */}
                      Melu is still building a picture of your family&apos;s patterns.
                    </p>
                  )}
                </section>

                {showFamilyDetails ? (
                  <section>
                    <p className={SECTION_LABEL}>FAMILY DETAILS</p>
                    <div className="divide-y divide-[#F0EFED] border-t border-[#F0EFED]">
                      <div className="py-3">
                        <div className="text-[14px] font-semibold text-[#1C1917]">Family</div>
                        <div className="text-[14px] text-[#78716C] mt-0.5">
                          {formatFamilyDetailsRow(answers.q1)}
                        </div>
                      </div>
                      <div className="py-3">
                        <div className="text-[14px] font-semibold text-[#1C1917]">Avoid</div>
                        <div className="text-[14px] text-[#78716C] mt-0.5">
                          {formatAvoidDetails(answers.q2, answers.q3)}
                        </div>
                      </div>
                      <div className="py-3">
                        <div className="text-[14px] font-semibold text-[#1C1917]">Cook time</div>
                        <div className="text-[14px] text-[#78716C] mt-0.5">
                          {cookTimeDetailLabel(answers.q6)}
                        </div>
                      </div>
                      <div className="py-3">
                        <div className="text-[14px] font-semibold text-[#1C1917]">Discovery pace</div>
                        <div className="text-[14px] text-[#78716C] mt-0.5">
                          {discoveryPaceLabel(answers.discoveryPace)}
                        </div>
                      </div>
                    </div>
                  </section>
                ) : null}
              </>
            )}
          </div>
        </div>

        {mode === "profile" ? (
          <>
            <footer className="mt-16 border-t border-[#E8E5E1] pt-10">
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="text-left text-[12px] font-normal text-[#A8A29E] transition-colors hover:text-[#78716C] hover:underline hover:underline-offset-2"
              >
                Start over from scratch
              </button>
            </footer>

            <AlertDialog
              open={showResetConfirm}
              onOpenChange={(open) => {
                setShowResetConfirm(open);
                if (!open) setResetError(null);
              }}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Start over?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes your Melu profile, meal plans, staples, and picks from our servers,
                    then sends you back to onboarding. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                {resetError ? (
                  <p className="px-6 pb-2 text-[13px] text-red-600">{resetError}</p>
                ) : null}
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={resetting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className={buttonVariants({ variant: "destructive" })}
                    disabled={resetting}
                    onClick={(e) => {
                      e.preventDefault();
                      handleConfirmReset();
                    }}
                  >
                    {resetting ? "Resetting…" : "Yes, start over"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : null}

        {mode === "onboarding" ? (
          <div className="mt-10 w-full max-w-[400px] mx-auto md:mt-12">
            <Button
              variant="melu"
              className="w-full h-14 rounded-full text-[17px] font-semibold"
              onClick={() => navigate("/home")}
            >
              Let&apos;s go
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
