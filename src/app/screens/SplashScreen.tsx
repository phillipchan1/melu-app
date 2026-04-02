import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "../components/ui/button";
import { ScreenShell } from "../components/design-system";
import { fetchProfileStatus } from "../lib/api";

export function SplashScreen() {
  const navigate = useNavigate();
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const status = await fetchProfileStatus();
        if (!cancelled && status.hasProfile) {
          navigate("/home", { replace: true });
          return;
        }
      } catch {
        // Stay on splash if status fails (offline / misconfigured)
      }
      if (!cancelled) setCheckingProfile(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (checkingProfile) {
    return (
      <ScreenShell className="flex items-center justify-center min-h-[100dvh]">
        <div className="w-8 h-8 rounded-full border-4 border-border border-t-primary animate-spin" />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell className="flex items-center justify-center">
      <div className="flex flex-col items-center text-center -mt-[60px] w-full">
        <div className="text-[26px] text-primary font-semibold mb-8">
          melu
        </div>

        <h1 className="text-[24px] text-foreground mb-5 max-w-[280px] font-semibold leading-[1.3]">
          Dinner, planned. 60 seconds.
        </h1>

        <p className="text-[16px] text-muted-foreground mb-10 max-w-[300px] font-normal leading-[1.6]">
          Melu learns your family. Every week it gets smarter. You approve and
          you&apos;re done.
          <br />
          <br />
          First, we need to know your family — who you&apos;re feeding, what you
          love, and what&apos;s off the table. About 2 minutes. You&apos;ll
          never need to do it again.
        </p>

        <Button
          variant="melu"
          onClick={() => navigate("/onboarding")}
          className="text-[17px] font-semibold"
        >
          Let's get started
        </Button>
      </div>
    </ScreenShell>
  );
}
