import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import type { ChefCard } from "../lib/api";
import { generatePlan } from "../lib/api";

import { ChefCard as ChefCardComponent, ScreenShell } from "../components/design-system";

const AUTO_ADVANCE_MS = 4000;

export function OnboardingTransition() {
  const navigate = useNavigate();
  const location = useLocation();
  const chefCard = (location.state as { chefCard?: ChefCard } | null)?.chefCard;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const didAdvance = useRef(false);

  const goToPlan = useCallback(async () => {
    if (didAdvance.current) return;
    didAdvance.current = true;
    setLoading(true);
    setError(null);
    try {
      const plan = await generatePlan();
      navigate("/plan", { state: { plan } });
    } catch (err) {
      didAdvance.current = false;
      setError(err instanceof Error ? err.message : "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!chefCard) return;
    const t = globalThis.setTimeout(() => {
      void goToPlan();
    }, AUTO_ADVANCE_MS);
    return () => globalThis.clearTimeout(t);
  }, [chefCard, goToPlan]);

  return (
    <ScreenShell className="flex flex-col items-center pt-12 pb-12">
      {chefCard ? (
        <>
          <button
            type="button"
            onClick={() => void goToPlan()}
            disabled={loading}
            className="cursor-pointer border-0 bg-transparent p-0 text-left disabled:opacity-60"
          >
            <ChefCardComponent card={chefCard} />
          </button>
          <p className="mt-6 text-[15px] text-muted-foreground text-center max-w-xs">
            Your plans get smarter the more you use{"\u00A0"}Melu.
          </p>
        </>
      ) : (
        <>
          <div className="mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-4 text-center">
            We&apos;re learning about you.
          </h1>
          <p className="text-[15px] text-muted-foreground text-center max-w-xs mb-8">
            Every meal we suggest will be tailored to your family.
          </p>
        </>
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
    </ScreenShell>
  );
}
