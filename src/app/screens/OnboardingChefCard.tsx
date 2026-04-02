import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { ChefCard } from "../lib/api";

import { ChefCard as ChefCardComponent } from "../components/design-system";
import { useOnboardingChefCardStore } from "../stores/onboardingChefCardStore";

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

  const displayCard = chefCard ?? (chefCardError ? FALLBACK_CARD : null);

  useEffect(() => {
    if (!chefCard && !chefCardError) {
      navigate("/onboarding", { replace: true });
    }
  }, [chefCard, chefCardError, navigate]);

  if (!displayCard) {
    return null;
  }

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-page py-12 gap-6">
      {/*
        Do not wrap ChefCard in <button> — the card contains "See your full profile" (nested buttons break clicks).
      */}
      <div className="w-full max-w-[340px]">
        <ChefCardComponent card={displayCard} chefCardError={chefCardError} />
      </div>

      {chefCardError ? (
        <div className="text-[14px] text-muted-foreground text-center max-w-xs space-y-2">
          <p>We&apos;ll refine this as you use Melu.</p>
        </div>
      ) : (
        <p className="text-[14px] text-muted-foreground text-center max-w-xs">
          Your plans get smarter the more you use{"\u00A0"}Melu.
        </p>
      )}

      <div className="flex flex-col items-center gap-3 w-full max-w-[400px]">
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="w-full rounded-full bg-primary px-6 py-3.5 text-[16px] font-semibold text-primary-foreground"
        >
          Plan this week&apos;s dinners
        </button>
      </div>
    </div>
  );
}
