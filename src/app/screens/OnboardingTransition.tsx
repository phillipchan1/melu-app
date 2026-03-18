import { useLocation, useNavigate } from "react-router";
import type { ChefCard } from "../lib/api";

import { ChefCard as ChefCardComponent, ScreenShell } from "../components/design-system";
import { Button } from "../components/ui/button";

export function OnboardingTransition() {
  const navigate = useNavigate();
  const location = useLocation();
  const chefCard = (location.state as { chefCard?: ChefCard } | null)?.chefCard;

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

      <Button
        variant="melu"
        onClick={() => navigate("/weekly-checkin")}
        className="mt-auto"
      >
        Build my first plan
      </Button>
    </ScreenShell>
  );
}
