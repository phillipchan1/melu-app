import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { ScreenShell } from "../components/design-system";
import { Button } from "../components/ui/button";
import { cn } from "../components/ui/utils";
import {
  TOGGLE_ORDER,
  WEEK_ORDER_MON_FIRST,
  getWeekDates,
  isFullDayInPast,
} from "../utils/weekDates";

function defaultSelectedSet(weekDates: ReturnType<typeof getWeekDates>): Set<string> {
  const next = new Set<string>();
  for (const d of WEEK_ORDER_MON_FIRST) {
    if (d === "Saturday" || d === "Sunday") continue;
    if (!isFullDayInPast(d, weekDates)) next.add(d);
  }
  return next;
}

export function WeeklyCheckIn() {
  const navigate = useNavigate();
  const weekDates = useMemo(() => getWeekDates(), []);
  const [selected, setSelected] = useState<Set<string>>(() => defaultSelectedSet(getWeekDates()));

  const count = selected.size;

  const toggle = (day: string, disabled: boolean) => {
    if (disabled) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const selectedNights = useMemo(
    () => WEEK_ORDER_MON_FIRST.filter((d) => selected.has(d)),
    [selected],
  );

  const handleNext = () => {
    if (selectedNights.length === 0) return;
    navigate("/weekly-checkin/context", { state: { selectedNights } });
  };

  const nextButton = (
    <Button
      variant="melu"
      className="w-full h-14 text-[17px] font-semibold rounded-full"
      disabled={count === 0}
      onClick={handleNext}
    >
      Next
    </Button>
  );

  return (
    <ScreenShell className="flex flex-col min-h-[100dvh] w-full max-w-[640px] md:max-w-[960px] mx-auto px-10 md:px-12 pb-28 md:pb-8">
      <div className="flex flex-1 flex-col gap-0 md:flex-row md:gap-12 md:items-start">
        <div className="flex min-w-0 flex-1 flex-col md:w-1/2">
          <div className="pt-10 pb-6">
            <h1 className="text-[20px] font-semibold text-foreground leading-tight">
              Which nights do you need dinner?
            </h1>
            <p className="text-[14px] text-muted-foreground mt-2 font-normal">
              Melu will build a plan for these nights.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {TOGGLE_ORDER.map(({ abbrev, full }) => {
              const on = selected.has(full);
              const past = isFullDayInPast(full, weekDates);
              const disabled = past;
              const entry = weekDates[abbrev];
              return (
                <button
                  key={full}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggle(full, disabled)}
                  className={cn(
                    "flex min-w-[72px] flex-col items-center justify-center gap-0.5 rounded-full px-4 py-3 text-[13px] font-semibold transition-colors",
                    disabled &&
                      "cursor-not-allowed border-[1.5px] border-[#E8E5E1] bg-[#F5F3F0] text-[#1C1917]/40",
                    !disabled &&
                      on &&
                      "border-[1.5px] border-transparent bg-[#7C9E7A] text-white [&_span:last-child]:text-white",
                    !disabled &&
                      !on &&
                      "border-[1.5px] border-[#D6D3CF] bg-white text-[#1C1917]",
                  )}
                >
                  <span className={cn(!disabled && !on && "text-[#1C1917]")}>{abbrev}</span>
                  <span
                    className={cn(
                      "text-[11px] font-normal leading-tight",
                      !disabled && on && "text-white",
                      !disabled && !on && "text-[#78716C]",
                      disabled && "text-[#1C1917]/40",
                    )}
                  >
                    {entry.dateLabel}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-10 hidden md:block">{nextButton}</div>
        </div>

        <div className="hidden min-w-0 flex-1 md:flex md:w-1/2 md:flex-col md:pt-10">
          <div className="rounded-2xl bg-white p-4 text-[14px] text-[#78716C] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            Your plan will be built for these nights.
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-background px-10 py-4 md:hidden">
        <div className="mx-auto w-full max-w-[640px]">{nextButton}</div>
      </div>
    </ScreenShell>
  );
}
