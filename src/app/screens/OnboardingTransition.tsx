import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import type { ChefCard } from "../lib/api";
import { generatePlan } from "../lib/api";

import { ChefCard as ChefCardComponent, ScreenShell } from "../components/design-system";
import { Button } from "../components/ui/button";

export function OnboardingTransition() {
  const navigate = useNavigate();
  const location = useLocation();
  const chefCard = (location.state as { chefCard?: ChefCard } | null)?.chefCard;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuildPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const plan = await generatePlan();
      navigate("/plan", { state: { plan } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell className="flex flex-col items-center pt-12 pb-12">
      {chefCard ? (
        <>
          <ChefCardComponent card={chefCard} />
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
        <div className="flex flex-col items-center gap-3 mb-4">
          <p className="text-sm text-destructive text-center max-w-xs">{error}</p>
          <Button variant="outline" size="sm" onClick={handleBuildPlan} disabled={loading}>
            Retry
          </Button>
        </div>
      )}

      <Button
        variant="melu"
        onClick={handleBuildPlan}
        disabled={loading}
        className="mt-auto"
      >
        {loading ? "Building your plan…" : "Build my first plan"}
      </Button>
    </ScreenShell>
  );
}
