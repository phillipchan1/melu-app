import { useLayoutEffect, useRef } from "react";

export interface OnboardingProgressBarProps {
  /** 1, 2, or 3 */
  currentStep: number;
  totalSteps: number;
}

/**
 * Segmented progress: segment i is full when currentStep >= i + 1 (on or past that step).
 * Forward navigation: newly filled segments use opacity transition 300ms; backward: no opacity transition.
 */
export function OnboardingProgressBar({
  currentStep,
  totalSteps,
}: Readonly<OnboardingProgressBarProps>) {
  const prevStepRef = useRef(currentStep);

  const prev = prevStepRef.current;
  const isForwardNav = currentStep > prev;
  const isBackwardNav = currentStep < prev;

  useLayoutEffect(() => {
    prevStepRef.current = currentStep;
  });

  const segmentJustFilledForward = (index: number) =>
    isForwardNav && currentStep >= index + 1 && prev < index + 1;

  return (
    <div
      className="flex w-[120px] gap-[6px] mx-auto mt-2 mb-1"
      aria-hidden
    >
      {Array.from({ length: totalSteps }, (_, index) => {
        const isFilled = currentStep >= index + 1;
        let transitionClass: string;
        if (segmentJustFilledForward(index)) {
          transitionClass = "transition-opacity duration-300 ease-out";
        } else if (isBackwardNav) {
          transitionClass = "transition-none";
        } else {
          transitionClass =
            "transition-[background-color,opacity] duration-200 ease-out";
        }

        return (
          <div
            key={index}
            className={`h-1 rounded-sm flex-1 bg-primary ${transitionClass} ${
              isFilled ? "opacity-100" : "opacity-20"
            }`}
          />
        );
      })}
    </div>
  );
}
