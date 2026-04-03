import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { generatePlan } from "../lib/api";
import { useWeeklyPlanStore } from "../stores/weeklyPlanStore";
import {
  filterNightsOnOrAfterToday,
  formatNightsForPlanSentence,
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

  const nightsSummaryLine = useMemo(() => {
    const sentence = formatNightsForPlanSentence(filteredNights, weekDates);
    return sentence ? `Building your plan for ${sentence}.` : "";
  }, [filteredNights, weekDates]);

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
    <div className="flex min-h-[100dvh] w-full flex-col justify-center bg-[#FAF8F5] px-10">
      <div className="mx-auto w-full max-w-[560px] py-12 text-left">
        {error ? (
          <p className="mb-4 text-left text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        {nightsSummaryLine ? (
          <p className="mb-10 text-left text-[13px] text-[#78716C]">{nightsSummaryLine}</p>
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
