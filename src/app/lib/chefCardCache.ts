import type { ChefCard } from "./api";

const STORAGE_KEY = "melu_chef_card_v1";

export interface ChefCardCachePayload {
  userId: string;
  chefCard: ChefCard;
}

export function loadChefCardCache(): ChefCardCachePayload | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<ChefCardCachePayload>;
    if (typeof p.userId !== "string" || p.userId.length === 0) return null;
    if (!p.chefCard || typeof p.chefCard !== "object") return null;
    if (typeof (p.chefCard as ChefCard).buildName !== "string") return null;
    return {
      userId: p.userId,
      chefCard: p.chefCard as ChefCard,
    };
  } catch {
    return null;
  }
}

export function saveChefCardCache(payload: ChefCardCachePayload): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore quota / private mode
  }
}

export function clearChefCardCache(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
