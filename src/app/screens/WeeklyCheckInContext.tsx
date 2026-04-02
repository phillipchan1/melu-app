import { Send } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { ChatBubble, ScreenShell } from "../components/design-system";
import { generatePlan } from "../lib/api";
import { supabase } from "../lib/supabase";
import { useWeeklyPlanStore } from "../stores/weeklyPlanStore";
import {
  FULL_TO_ABBREV,
  filterNightsOnOrAfterToday,
  getWeekDates,
} from "../utils/weekDates";

function firstNameFromSessionUser(user: {
  user_metadata?: Record<string, unknown>;
  email?: string;
}): string {
  const full = user.user_metadata?.full_name;
  const emailLocal = user.email?.split("@")[0] ?? "";
  const raw =
    typeof full === "string" && full.trim().length > 0 ? full.trim() : emailLocal || "there";
  const first = raw.split(/\s+/)[0] ?? raw;
  return first;
}

export type WeeklyCheckInLocationState = {
  selectedNights?: string[];
};

const skipPillClass =
  "rounded-full border-[1.5px] border-[#D6D3CF] bg-transparent px-4 py-2 text-[14px] font-medium text-[#78716C]";

function LoadingPlan() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-page">
      <div className="text-[22px] text-primary font-semibold mb-3">melu</div>
      <p className="text-[15px] text-muted-foreground font-normal">
        Building your plan
        <span className="inline-block w-[1.2em] text-left animate-pulse">...</span>
      </p>
    </div>
  );
}

export function WeeklyCheckInContext() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as WeeklyCheckInLocationState | null;
  const selectedNights = state?.selectedNights;
  const setLastPlanRequest = useWeeklyPlanStore((s) => s.setLastPlanRequest);

  const weekDates = useMemo(() => getWeekDates(), []);

  const summaryPills = useMemo(() => {
    if (!selectedNights?.length) return [];
    const filtered = filterNightsOnOrAfterToday(selectedNights, weekDates);
    return filtered.map((full) => {
      const abbrev = FULL_TO_ABBREV[full];
      const entry = abbrev ? weekDates[abbrev] : null;
      return {
        full,
        line: entry ? `${abbrev} ${entry.dateLabel}` : full,
      };
    });
  }, [selectedNights, weekDates]);

  const [firstName, setFirstName] = useState("there");
  const [input, setInput] = useState("");
  const [userMessage, setUserMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedNights?.length) {
      navigate("/weekly-checkin", { replace: true });
    }
  }, [selectedNights, navigate]);

  const runGenerate = useCallback(
    async (weeklyContext: string) => {
      if (!selectedNights?.length) return;
      const filtered = filterNightsOnOrAfterToday(selectedNights, getWeekDates());
      if (filtered.length === 0) {
        setError("No upcoming nights selected. Go back and pick at least one future night.");
        return;
      }
      setError(null);
      setLoading(true);
      const todayDate = new Date().toISOString();
      const payload = { selectedNights: filtered, weeklyContext, todayDate };
      try {
        const plan = await generatePlan(payload);
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
    [selectedNights, navigate, setLastPlanRequest],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!cancelled && user) {
        setFirstName(firstNameFromSessionUser(user));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSkip = () => {
    void runGenerate("");
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setUserMessage(trimmed);
    setInput("");
    void runGenerate(trimmed);
  };

  if (!selectedNights?.length) {
    return null;
  }

  if (loading) {
    return <LoadingPlan />;
  }

  const opening = `Hey ${firstName} — anything I should know before I build your dinners this week?`;

  const inputBar = (
    <div className="bg-background px-0 py-3 md:border-t md:border-border md:pt-3 md:pb-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Type a message..."
          className="min-h-11 flex-1 rounded-full border border-border bg-secondary px-4 py-3 text-[15px] font-normal text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="button"
          onClick={handleSend}
          className="flex h-11 min-w-11 shrink-0 items-center justify-center rounded-full bg-primary"
        >
          <Send className="h-5 w-5 text-primary-foreground" />
        </button>
      </div>
    </div>
  );

  return (
    <ScreenShell className="relative flex min-h-[100dvh] w-full max-w-[640px] flex-col px-10 pb-28 md:mx-auto md:max-w-[960px] md:px-12 md:pb-8">
      {/* Placement A: fixed skip — mobile + desktop */}
      <button
        type="button"
        onClick={handleSkip}
        className={`fixed right-5 top-4 z-20 ${skipPillClass}`}
      >
        Skip — nothing to add
      </button>

      <div className="flex w-full flex-1 flex-col gap-0 md:flex-row md:gap-12 md:items-stretch">
        {/* Left column: summary + chat + input (desktop: input at bottom of column) */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col md:w-1/2 md:max-h-[100dvh]">
          <div className="shrink-0 pt-14 md:pt-4">
            <div className="mb-3 rounded-xl bg-card p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
              <div className="mb-2 text-[10px] font-semibold tracking-[0.08em] text-[#78716C]">
                THIS WEEK
              </div>
              <div className="flex flex-wrap gap-2">
                {summaryPills.map(({ full, line }) => (
                  <span
                    key={full}
                    className="inline-flex rounded-lg border border-[#7C9E7A] px-2.5 py-1 text-[12px] font-medium text-[#7C9E7A]"
                  >
                    {line}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col md:min-h-0">
            <div className="flex min-h-0 flex-1 flex-col space-y-3 overflow-y-auto pb-24 md:pb-4">
              {error && (
                <p className="text-sm text-destructive px-1" role="alert">
                  {error}
                </p>
              )}
              <ChatBubble variant="ai">
                <p className="text-[15px] font-normal text-foreground">{opening}</p>
              </ChatBubble>
              {userMessage && (
                <ChatBubble variant="user">
                  <p className="text-[15px] font-normal text-primary-foreground">{userMessage}</p>
                </ChatBubble>
              )}
            </div>

            {/* Mobile: fixed input full viewport width; desktop: static at bottom of left column */}
            <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-background px-10 py-3 md:static md:z-0 md:mt-auto md:border-t-0 md:px-0 md:py-0">
              <div className="mx-auto w-full max-w-[640px] md:mx-0 md:max-w-none">{inputBar}</div>
            </div>
          </div>
        </div>

        {/* Right column: helper card — desktop only */}
        <div className="hidden min-w-0 flex-1 flex-col md:flex md:w-1/2 md:pt-4">
          <div className="rounded-2xl bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            <h2 className="text-[15px] font-semibold leading-snug text-[#1C1917]">
              Nothing to add?
            </h2>
            <p className="mt-1 text-[14px] leading-[1.5] text-[#78716C]">
              That&apos;s fine. Melu will build your plan based on what it already knows about your
              family.
            </p>
            {/* Placement B: second Skip — desktop only */}
            <button
              type="button"
              onClick={handleSkip}
              className={`mt-4 w-full ${skipPillClass}`}
            >
              Skip — nothing to add
            </button>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
