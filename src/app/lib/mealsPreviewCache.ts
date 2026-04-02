const STORAGE_KEY = "melu_meals_preview_v2";

export interface MealsPreviewCachePayload {
  userId: string;
  topStapleMeals: string[];
  topAspirations: string[];
}

export function loadMealsPreviewCache(): MealsPreviewCachePayload | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<MealsPreviewCachePayload>;
    if (typeof p.userId !== "string" || p.userId.length === 0) return null;
    return {
      userId: p.userId,
      topStapleMeals: Array.isArray(p.topStapleMeals) ? p.topStapleMeals : [],
      topAspirations: Array.isArray(p.topAspirations) ? p.topAspirations : [],
    };
  } catch {
    return null;
  }
}

export function saveMealsPreviewCache(payload: MealsPreviewCachePayload): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore quota / private mode
  }
}

export function clearMealsPreviewCache(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("melu_meals_preview_v1");
  } catch {
    // ignore
  }
}
