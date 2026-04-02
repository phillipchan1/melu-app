import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { fetchMealsPreview } from "../lib/api";
import { useOnboardingChefCardStore } from "../stores/onboardingChefCardStore";

function buildRotatingLines(meals: string[], aspirations: string[]): string[] {
  const lines = [
    meals[0] ? `Counting your ${meals[0].toLowerCase()}s...` : null,
    meals[1] ? `Consulting the ${meals[1].toLowerCase()} council...` : null,
    meals[2] ? `Weighing your feelings on ${meals[2].toLowerCase()}...` : null,
    `Reading between the lines...`,
    aspirations[0] ? `Noting your relationship with ${aspirations[0].toLowerCase()}...` : null,
    `Calibrating your boldness quotient...`,
    `Cross-referencing your flavor loyalties...`,
    `Asking the algorithm to relax...`,
    `Tallying the weeknight wins...`,
  ].filter((x): x is string => x != null && x !== "");
  return lines;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

export function ChefCardLoading() {
  const navigate = useNavigate();
  /** Once we have seen a real promise, clearing it after success must not trigger the “no promise” redirect. */
  const sawChefCardPromiseRef = useRef(false);
  const chefCardPromise = useOnboardingChefCardStore((s) => s.chefCardPromise);
  const setChefCard = useOnboardingChefCardStore((s) => s.setChefCard);
  const setChefCardPromise = useOnboardingChefCardStore((s) => s.setChefCardPromise);
  const setChefCardError = useOnboardingChefCardStore((s) => s.setChefCardError);

  const [lineIndex, setLineIndex] = useState(0);
  const [meals, setMeals] = useState<string[]>([]);
  const [aspirations, setAspirations] = useState<string[]>([]);

  const lines = useMemo(() => buildRotatingLines(meals, aspirations), [meals, aspirations]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const preview = await fetchMealsPreview();
        if (!cancelled) {
          setMeals(preview.topStapleMeals);
          setAspirations(preview.topAspirations);
        }
      } catch {
        // SPEC GAP: preview failed — static lines still rotate
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (lines.length === 0) return;
    const t = globalThis.setInterval(() => {
      setLineIndex((i) => (i + 1) % lines.length);
    }, 1500);
    return () => globalThis.clearInterval(t);
  }, [lines.length]);

  useEffect(() => {
    if (chefCardPromise == null) {
      if (!sawChefCardPromiseRef.current) {
        navigate("/onboarding", { replace: true });
      }
      return;
    }

    sawChefCardPromiseRef.current = true;

    let cancelled = false;
    void (async () => {
      try {
        const settled = await Promise.all([delay(2500), chefCardPromise]);
        const card = settled[1];
        if (cancelled) return;
        setChefCard(card);
        setChefCardError(false);
        navigate("/onboarding/chef-card", { replace: true });
        queueMicrotask(() => setChefCardPromise(null));
      } catch {
        if (cancelled) return;
        setChefCardError(true);
        setChefCard(null);
        navigate("/onboarding/chef-card", { replace: true });
        queueMicrotask(() => setChefCardPromise(null));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chefCardPromise, navigate, setChefCard, setChefCardError, setChefCardPromise]);

  const line = lines.length > 0 ? lines[lineIndex % lines.length] : "Reading between the lines...";

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-page min-h-[55vh]">
        <p
          key={lineIndex}
          className="chef-loading-line text-[20px] font-medium text-foreground text-center max-w-[320px]"
        >
          {line}
        </p>
      </div>
      <div className="shrink-0 pb-12 px-page flex justify-center">
        <p className="text-[14px] text-muted-foreground text-center tracking-[0.01em] max-w-[320px]">
          Getting to know your family&apos;s kitchen.
        </p>
      </div>
    </div>
  );
}
