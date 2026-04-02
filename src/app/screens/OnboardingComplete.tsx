import { useNavigate } from "react-router";
import { postChefCardGenerate } from "../lib/api";
import { useOnboardingChefCardStore } from "../stores/onboardingChefCardStore";

export function OnboardingComplete() {
  const navigate = useNavigate();
  const setChefCardPromise = useOnboardingChefCardStore((s) => s.setChefCardPromise);
  const setChefCardError = useOnboardingChefCardStore((s) => s.setChefCardError);

  const handleCta = () => {
    setChefCardError(false);
    const p = postChefCardGenerate();
    setChefCardPromise(p);
    navigate("/onboarding/loading");
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-page py-12">
      <div className="w-full max-w-[400px] flex flex-col items-center text-center">
        <div className="text-[22px] text-primary font-semibold">melu</div>

        <div className="h-12 shrink-0" aria-hidden />

        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          That&apos;s everything we need.
        </p>

        <div className="h-3 shrink-0" aria-hidden />

        <h1 className="text-[28px] font-bold text-foreground leading-tight">
          Melu knows your kitchen now.
        </h1>

        <div className="h-4 shrink-0" aria-hidden />

        <p className="text-[16px] text-muted-foreground leading-[1.5] max-w-[320px]">
          Based on what you cook and where you want to go, we&apos;re building something just for you.
        </p>

        <div className="h-10 shrink-0" aria-hidden />

        <button
          type="button"
          onClick={handleCta}
          className="w-full max-w-[320px] h-[52px] rounded-[26px] bg-primary text-primary-foreground text-[16px] font-semibold"
        >
          See what Melu thinks
        </button>
      </div>
    </div>
  );
}
