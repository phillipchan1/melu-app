import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { ChefCard, ScreenShell } from "../components/design-system";
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
import { buttonVariants } from "../components/ui/button";
import { clearOnboardingDraft } from "../lib/onboardingDraft";
import type { ChefCard as ChefCardType, Staple } from "../lib/api";
import { fetchChefCard, fetchStaples, resetProfile } from "../lib/api";
import {
  clearChefCardCache,
  loadChefCardCache,
  saveChefCardCache,
  type ChefCardCachePayload,
} from "../lib/chefCardCache";
import { clearMealsPreviewCache } from "../lib/mealsPreviewCache";
import { supabase } from "../lib/supabase";
import { useOnboardingChefCardStore } from "../stores/onboardingChefCardStore";
import { useWeeklyPlanStore } from "../stores/weeklyPlanStore";

function staplesProfileSummary(count: number): string {
  if (count === 0) return "No staples saved yet.";
  if (count === 1) return "1 dinner staple saved.";
  return `${count} dinner staples saved.`;
}

export function ProfilePreferences() {
  const navigate = useNavigate();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [chefCard, setChefCard] = useState<ChefCardType | null>(null);
  const [staples, setStaples] = useState<Staple[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setError(null);

      if (!supabase) {
        setLoading(true);
        try {
          const [card, staplesList] = await Promise.all([
            fetchChefCard(),
            fetchStaples().catch(() => [] as Staple[]),
          ]);
          if (!cancelled) {
            setChefCard(card);
            setStaples(staplesList);
          }
        } catch (e) {
          if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load profile");
        } finally {
          if (!cancelled) setLoading(false);
        }
        return;
      }

      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user || cancelled) {
        setLoading(false);
        return;
      }

      const rawCache = loadChefCardCache();
      let cacheForUser: ChefCardCachePayload | null = null;
      if (rawCache && rawCache.userId !== user.id) {
        clearChefCardCache();
      } else if (rawCache && rawCache.userId === user.id) {
        cacheForUser = rawCache;
        setChefCard(rawCache.chefCard);
        setLoading(false);
      } else {
        setLoading(true);
      }

      try {
        const [card, staplesList] = await Promise.all([
          fetchChefCard(),
          fetchStaples().catch(() => [] as Staple[]),
        ]);
        if (cancelled) return;
        setChefCard(card);
        setStaples(staplesList);
        if (card) {
          saveChefCardCache({ userId: user.id, chefCard: card });
        } else {
          clearChefCardCache();
        }
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : "Failed to load profile";
          if (!cacheForUser) {
            setError(msg);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ScreenShell>
      <div className="flex items-center justify-center relative pt-12 pb-6">
        <button
          onClick={() => navigate("/home")}
          className="absolute left-page"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-[17px] text-foreground font-semibold">
          Your Cooking Profile
        </h1>
      </div>

      <div className="mb-4">
        <p className="text-[14px] text-muted-foreground font-normal leading-[1.5]">
          This is your cooking archetype based on your answers. Your plans get
          smarter the more you use{"\u00A0"}Melu.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-4 border-border border-t-primary animate-spin" />
        </div>
      )}

      {error && (
        <p className="text-[14px] text-red-500 text-center py-4">{error}</p>
      )}

      {!loading && !error && chefCard && (
        <>
          <div className="flex justify-center">
            <ChefCard card={chefCard} />
          </div>

          <div className="mt-8 mb-6 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-[15px] font-semibold text-foreground mb-1">Your staples</h2>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  {staplesProfileSummary(staples.length)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/staples")}
                className="shrink-0 text-[14px] font-semibold text-primary"
              >
                Manage
              </button>
            </div>
          </div>

          <div className="mb-6 text-center mt-6">
            <p className="text-[13px] text-muted-foreground font-normal leading-[1.5]">
              To start over, use Reset profile below — it clears your saved data and questionnaire.
            </p>
          </div>
        </>
      )}

      {!loading && !error && !chefCard && (
        <div className="text-center py-8">
          <p className="text-[15px] text-muted-foreground mb-6">
            Complete onboarding to see your Chef Card.
          </p>
          <button
            onClick={() => navigate("/onboarding")}
            className="text-[15px] text-primary font-semibold"
          >
            Get started
          </button>
        </div>
      )}

      {!loading && chefCard && (
        <div className="text-center mt-8 pb-8">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="text-[14px] text-muted-foreground font-normal cursor-pointer"
          >
            Reset profile
          </button>
        </div>
      )}

      <AlertDialog
        open={showResetConfirm}
        onOpenChange={(open) => {
          setShowResetConfirm(open);
          if (!open) setResetError(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset profile?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes your Melu profile, meal plans, staples, and picks from our servers,
              then sends you back to onboarding. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {resetError ? (
            <p className="text-[13px] text-red-600 px-6 pb-2">{resetError}</p>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={resetting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              disabled={resetting}
              onClick={(e) => {
                e.preventDefault();
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
                    useOnboardingChefCardStore.getState().reset();
                    setShowResetConfirm(false);
                    navigate("/onboarding");
                  } catch (err) {
                    setResetError(err instanceof Error ? err.message : "Reset failed");
                  } finally {
                    setResetting(false);
                  }
                })();
              }}
            >
              {resetting ? "Resetting…" : "Yes, reset"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ScreenShell>
  );
}