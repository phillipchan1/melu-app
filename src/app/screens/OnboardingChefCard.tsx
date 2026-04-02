import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import type { ChefCard } from "../lib/api";
import { generatePlan } from "../lib/api";

import { ChefCard as ChefCardComponent } from "../components/design-system";
import { cn } from "../components/ui/utils";
import { useOnboardingChefCardStore } from "../stores/onboardingChefCardStore";

const AUTO_ADVANCE_MS = 4000;
const PULSE_AT_MS = 3500;

const FALLBACK_CARD: ChefCard = {
  buildName: "Your kitchen",
  overallScore: 0,
  comparisons: [
    { name: "The Weeknight Pro", desc: "Gets dinner on the table without fuss.", match: 85 },
    { name: "The Flavor Curious", desc: "Loves trying new things when time allows.", match: 78 },
    { name: "The Family Feeder", desc: "Puts the people at the table first.", match: 72 },
  ],
  dimensionScores: {
    Comfort: 50,
    Speed: 50,
    Boldness: 50,
    Discovery: 50,
    Nourishment: 50,
  },
  cuisineTags: [],
};

export function OnboardingChefCard() {
  const navigate = useNavigate();
  const chefCard = useOnboardingChefCardStore((s) => s.chefCard);
  const chefCardError = useOnboardingChefCardStore((s) => s.chefCardError);
  const resetOnboardingChefCard = useOnboardingChefCardStore((s) => s.reset);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pulse, setPulse] = useState(false);
  const didAdvance = useRef(false);

  const displayCard = chefCard ?? (chefCardError ? FALLBACK_CARD : null);

  const goToPlan = useCallback(async () => {
    if (didAdvance.current) return;
    didAdvance.current = true;
    setLoading(true);
    setError(null);
    try {
      const plan = await generatePlan();
      resetOnboardingChefCard();
      navigate("/plan", { state: { plan } });
    } catch (err) {
      didAdvance.current = false;
      setError(err instanceof Error ? err.message : "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  }, [navigate, resetOnboardingChefCard]);

  useEffect(() => {
    if (!chefCard && !chefCardError) {
      navigate("/onboarding", { replace: true });
    }
  }, [chefCard, chefCardError, navigate]);

  useEffect(() => {
    if (!displayCard) return;
    const t = globalThis.setTimeout(() => {
      void goToPlan();
    }, AUTO_ADVANCE_MS);
    return () => globalThis.clearTimeout(t);
  }, [displayCard, goToPlan]);

  useEffect(() => {
    const t = globalThis.setTimeout(() => setPulse(true), PULSE_AT_MS);
    const t2 = globalThis.setTimeout(() => setPulse(false), AUTO_ADVANCE_MS);
    return () => {
      globalThis.clearTimeout(t);
      globalThis.clearTimeout(t2);
    };
  }, []);

  if (!displayCard) {
    return null;
  }

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-page py-12">
      <button
        type="button"
        onClick={() => void goToPlan()}
        disabled={loading}
        className={cn(
          "cursor-pointer border-0 bg-transparent p-0 text-left disabled:opacity-60 max-w-[340px] w-full rounded-2xl transition-[box-shadow] duration-500",
          pulse && "shadow-[0_0_28px_rgba(0,0,0,0.18)]",
        )}
      >
        <ChefCardComponent card={displayCard} chefCardError={chefCardError} />
      </button>
      {chefCardError ? (
        <p className="mt-6 text-[14px] text-muted-foreground text-center max-w-xs">
          We&apos;ll refine this as you use Melu.
        </p>
      ) : (
        <p className="mt-6 text-[14px] text-muted-foreground text-center max-w-xs">
          Your plans get smarter the more you use{"\u00A0"}Melu.
        </p>
      )}

      {error && (
        <div className="flex flex-col items-center gap-3 mb-4 mt-4">
          <p className="text-sm text-destructive text-center max-w-xs">{error}</p>
          <button
            type="button"
            className="text-sm text-primary font-medium"
            onClick={() => void goToPlan()}
            disabled={loading}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
