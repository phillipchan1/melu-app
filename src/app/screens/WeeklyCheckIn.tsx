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

  return (
    <ScreenShell className="mx-auto flex min-h-[100dvh] w-full max-w-[580px] flex-col px-10 pb-28 pt-12 text-left">
      <h1 className="text-[24px] font-bold leading-tight text-[#1C1917]">
        Which nights do you need dinner?
      </h1>
      <p className="mb-6 mt-0 text-[14px] font-normal text-[#78716C]">
        Melu will build a plan for these nights.
      </p>

      <div className="flex flex-wrap gap-[10px]">
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

      <Button
        variant="melu"
        className="mt-8 h-14 w-full rounded-full text-[17px] font-semibold"
        disabled={count === 0}
        onClick={handleNext}
      >
        Next
      </Button>
    </ScreenShell>
  );
}
