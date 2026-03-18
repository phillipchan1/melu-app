import { useNavigate } from "react-router";

import { Button } from "../components/ui/button";
import { ScreenShell } from "../components/design-system";

export function SplashScreen() {
  const navigate = useNavigate();

  return (
    <ScreenShell className="flex items-center justify-center">
      <div className="flex flex-col items-center text-center -mt-[60px] w-full">
        <div className="text-[26px] text-primary font-semibold mb-8">
          melu
        </div>

        <h1 className="text-[24px] text-foreground mb-5 max-w-[280px] font-semibold leading-[1.3]">
          Dinner, planned.
          <br />
          Every week. In 60
          <br />
          seconds.
        </h1>

        <p className="text-[16px] text-muted-foreground mb-10 max-w-[300px] font-normal leading-[1.6]">
          To plan for you, Melu needs to know your family — who you're feeding, what you love, and what's off the table. It takes about 2 minutes. You'll never need to do it again.
        </p>

        <Button
          variant="melu"
          onClick={() => navigate("/onboarding")}
          className="mb-4 text-[17px] font-semibold"
        >
          Let's get started
        </Button>

        <p className="text-[13px] text-muted-foreground font-normal">
          No account needed to try it.
        </p>
      </div>
    </ScreenShell>
  );
}
