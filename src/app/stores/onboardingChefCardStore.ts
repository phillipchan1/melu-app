import { create } from "zustand";

import type { ChefCard } from "../lib/api";

interface OnboardingChefCardState {
  chefCardPromise: Promise<ChefCard> | null;
  chefCard: ChefCard | null;
  chefCardError: boolean;
  setChefCardPromise: (p: Promise<ChefCard> | null) => void;
  setChefCard: (card: ChefCard | null) => void;
  setChefCardError: (v: boolean) => void;
  reset: () => void;
}

export const useOnboardingChefCardStore = create<OnboardingChefCardState>((set) => ({
  chefCardPromise: null,
  chefCard: null,
  chefCardError: false,
  setChefCardPromise: (p) => set({ chefCardPromise: p }),
  setChefCard: (card) => set({ chefCard: card }),
  setChefCardError: (v) => set({ chefCardError: v }),
  reset: () => set({ chefCardPromise: null, chefCard: null, chefCardError: false }),
}));
