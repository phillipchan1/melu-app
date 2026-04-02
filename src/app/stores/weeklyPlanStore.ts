import { create } from "zustand";

import type { Plan } from "../lib/api";

export interface LastPlanRequest {
  selectedNights: string[];
  weeklyContext: string;
  todayDate: string;
}

interface WeeklyPlanState {
  currentPlan: Plan | null;
  setCurrentPlan: (plan: Plan | null) => void;
  /** Populated later; optional until wired. */
  nextPlan: Plan | null;
  setNextPlan: (plan: Plan | null) => void;
  /** Last successful generate payload; used for “Try a different plan”. */
  lastPlanRequest: LastPlanRequest | null;
  setLastPlanRequest: (r: LastPlanRequest | null) => void;
}

export const useWeeklyPlanStore = create<WeeklyPlanState>((set) => ({
  currentPlan: null,
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  nextPlan: null,
  setNextPlan: (plan) => set({ nextPlan: plan }),
  lastPlanRequest: null,
  setLastPlanRequest: (r) => set({ lastPlanRequest: r }),
}));
