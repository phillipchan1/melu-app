import { create } from "zustand";

import type { Plan } from "../lib/api";

interface WeeklyPlanState {
  currentPlan: Plan | null;
  setCurrentPlan: (plan: Plan | null) => void;
  /** Populated later; optional until wired. */
  nextPlan: Plan | null;
  setNextPlan: (plan: Plan | null) => void;
}

export const useWeeklyPlanStore = create<WeeklyPlanState>((set) => ({
  currentPlan: null,
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  nextPlan: null,
  setNextPlan: (plan) => set({ nextPlan: plan }),
}));
