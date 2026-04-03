import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { generatePlan } from "../lib/api";
import { useWeeklyPlanStore } from "../stores/weeklyPlanStore";
import {
  FULL_TO_ABBREV,
  filterNightsOnOrAfterToday,
  getWeekDates,
} from "../utils/weekDates";

export type WeeklyCheckInLocationState = {
  selectedNights?: string[];
};

function LoadingPlan({ showContextLine }: { readonly showContextLine: boolean }) {
  const [dotCount, setDotCount] = useState(1);
  useEffect(() => {
    const t = globalThis.setInterval(() => {
      setDotCount((c) => (c >= 3 ? 1 : c + 1));
    }, 600);
    return () => globalThis.clearInterval(t);
  }, []);
  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-[#FAF8F5] px-10">
      <div className="mx-auto flex w-full max-w-[560px] flex-col items-center">
        <div className="text-[22px] font-semibold text-[#7C9E7A]">melu</div>
        <p className="mt-4 text-center text-[15px] font-normal text-[#78716C]">
          Building your plan{".".repeat(dotCount)}
        </p>
        {showContextLine ? (
          <p className="mt-2 text-center text-[13px] italic text-[#78716C]">
            Taking into account what you shared.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function WeeklyCheckInContext() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as WeeklyCheckInLocationState | null;
  const selectedNights = state?.selectedNights;
  const setLastPlanRequest = useWeeklyPlanStore((s) => s.setLastPlanRequest);
  const setCurrentPlan = useWeeklyPlanStore((s) => s.setCurrentPlan);

  const weekDates = useMemo(() => getWeekDates(), []);

  const [textareaValue, setTextareaValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submittedContextForLoadingRef = useRef("");

  useEffect(() => {
    if (!selectedNights?.length) {
      navigate("/weekly-checkin", { replace: true });
    }
  }, [selectedNights, navigate]);

  const filteredNights = useMemo(() => {
    if (!selectedNights?.length) return [];
    return filterNightsOnOrAfterToday(selectedNights, weekDates);
  }, [selectedNights, weekDates]);

  const runGenerate = useCallback(
    async (weeklyContext: string) => {
      if (!selectedNights?.length) return;
      const filtered = filterNightsOnOrAfterToday(selectedNights, getWeekDates());
      if (filtered.length === 0) {
        setError("No upcoming nights selected. Go back and pick at least one future night.");
        return;
      }
      submittedContextForLoadingRef.current = weeklyContext;
      setError(null);
      setLoading(true);
      const todayDate = new Date().toISOString();
      const payload = { selectedNights: filtered, weeklyContext, todayDate };
      try {
        const plan = await generatePlan(payload);
        setCurrentPlan(plan);
        setLastPlanRequest({
          selectedNights: filtered,
          weeklyContext,
          todayDate,
        });
        navigate("/plan", { state: { plan }, replace: true });
      } catch (e) {
        setLoading(false);
        setError(e instanceof Error ? e.message : "Could not build plan");
      }
    },
    [selectedNights, navigate, setLastPlanRequest, setCurrentPlan],
  );

  const handleBuild = () => {
    void runGenerate(textareaValue.trim());
  };

  if (!selectedNights?.length) {
    return null;
  }

  if (loading) {
    return (
      <LoadingPlan showContextLine={submittedContextForLoadingRef.current.length > 0} />
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col justify-center bg-[#FAF8F5] py-12">
      <div className="mx-auto w-full max-w-[560px] px-10 text-left md:px-0">
        {error ? (
          <p className="mb-4 text-left text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        {filteredNights.length > 0 ? (
          <div>
            <p className="mb-2 text-left text-[12px] font-medium text-[#78716C]">
              Anything Melu should know for
            </p>
            <div className="mb-7 flex flex-wrap gap-2">
              {filteredNights.map((full) => {
                const abbrev = FULL_TO_ABBREV[full];
                const entry = abbrev ? weekDates[abbrev] : null;
                const dayAbbr = abbrev ?? "";
                const dateLine = entry?.dateLabel ?? "";
                return (
                  <div
                    key={full}
                    className="min-w-[64px] cursor-default rounded-[10px] border-[1.5px] border-[#C8D9C7] bg-white px-[14px] py-2 text-center text-[11px] text-[#4A6741]"
                  >
                    <div className="font-bold tracking-[0.05em]">{dayAbbr}</div>
                    <div className="font-normal">{dateLine}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        <textarea
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
          placeholder="e.g. 'Having guests Thursday' · 'Low on groceries' · 'Busy week, keep it simple'"
          className="w-full min-h-[120px] resize-none rounded-2xl border-[1.5px] border-[#E8E5E1] bg-white px-5 py-5 text-[16px] leading-[1.6] text-[#1C1917] shadow-[0_1px_4px_rgba(0,0,0,0.06)] outline-none placeholder:italic placeholder:text-[#B5B2AE] focus:border-[#7C9E7A] focus:shadow-[0_0_0_3px_rgba(124,158,122,0.15)] md:min-h-[160px]"
          style={{ fontFamily: "inherit" }}
        />

        <p className="mt-3 text-left text-[12px] text-[#78716C]">
          Melu handles the rest — just share what&apos;s different this week.
        </p>

        <button
          type="button"
          onClick={handleBuild}
          className="mt-8 h-14 w-full cursor-pointer rounded-full border-none bg-[#7C9E7A] text-[17px] font-semibold text-white hover:bg-[#6B8F69] active:bg-[#5F7F5E]"
        >
          Build my plan
        </button>
      </div>
    </div>
  );
}
