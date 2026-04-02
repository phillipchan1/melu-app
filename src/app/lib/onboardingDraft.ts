import type { OnboardingAnswers, Staple } from './api';

export const ONBOARDING_DRAFT_KEY = 'melu:onboarding-draft';

const DRAFT_VERSION = 2 as const;

export type OnboardingDraft = {
  version: typeof DRAFT_VERSION;
  answers: OnboardingAnswers;
  sectionIndex: number;
  q2Other: string;
};

function canUseSessionStorage(): boolean {
  return typeof sessionStorage !== 'undefined';
}

function isStaple(x: unknown): x is Staple {
  if (!x || typeof x !== 'object') return false;
  const m = x as Record<string, unknown>;
  return (
    typeof m.id === 'string' &&
    typeof m.name === 'string' &&
    typeof m.cuisine === 'string' &&
    (m.complexityTier === undefined ||
      m.complexityTier === 'simple' ||
      m.complexityTier === 'moderate' ||
      m.complexityTier === 'complex') &&
    (m.custom === undefined || typeof m.custom === 'boolean') &&
    (m.libraryMealId === undefined || typeof m.libraryMealId === 'string')
  );
}

function isStringArray(x: unknown): x is string[] {
  return Array.isArray(x) && x.every((i) => typeof i === 'string');
}

function parseQ1FromDraft(
  defaults: OnboardingAnswers['q1'],
  q1Raw: unknown,
): OnboardingAnswers['q1'] {
  if (!q1Raw || typeof q1Raw !== 'object' || Array.isArray(q1Raw)) {
    return defaults;
  }
  const q = q1Raw as Record<string, unknown>;
  const adults = Number(q.adults);
  const kids = Number(q.kids);
  return {
    adults: Number.isFinite(adults) ? Math.min(8, Math.max(1, adults)) : defaults.adults,
    kids: Number.isFinite(kids) ? Math.min(8, Math.max(0, kids)) : defaults.kids,
    kidAges: isStringArray(q.kidAges) ? q.kidAges : defaults.kidAges ?? [],
  };
}

function parseStaplesFromDraft(defaults: OnboardingAnswers, a: Record<string, unknown>): Staple[] {
  if (Array.isArray(a.staples) && a.staples.every(isStaple)) {
    return a.staples;
  }
  if (Array.isArray(a.q7) && a.q7.every(isStaple)) {
    return a.q7;
  }
  return defaults.staples;
}

/** Merge stored answers onto defaults with basic validation; invalid fields fall back to defaults. */
export function mergeDraftAnswers(
  defaults: OnboardingAnswers,
  raw: unknown,
): OnboardingAnswers {
  if (!raw || typeof raw !== 'object') return defaults;
  const a = raw as Record<string, unknown>;

  const q1 = parseQ1FromDraft(defaults.q1, a.q1);
  const q2 = isStringArray(a.q2) ? a.q2 : defaults.q2;
  const q3 = isStringArray(a.q3) ? a.q3 : defaults.q3;
  const q4 = typeof a.q4 === 'string' ? a.q4 : defaults.q4;
  const q5 = isStringArray(a.q5) ? a.q5 : defaults.q5;
  const q6 = typeof a.q6 === 'string' ? a.q6 : defaults.q6;
  const staples = parseStaplesFromDraft(defaults, a);
  const q8 = typeof a.q8 === 'string' ? a.q8 : defaults.q8;
  const q9 = typeof a.q9 === 'string' ? a.q9 : defaults.q9;

  return { q1, q2, q3, q4, q5, q6, staples, q8, q9 };
}

export function loadOnboardingDraft(
  defaults: OnboardingAnswers,
): Pick<OnboardingDraft, 'answers' | 'sectionIndex' | 'q2Other'> | null {
  if (!canUseSessionStorage()) return null;
  try {
    const raw = sessionStorage.getItem(ONBOARDING_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return null;
    const o = parsed as Record<string, unknown>;
    if (o.version !== 1 && o.version !== 2) return null;
    const answers = mergeDraftAnswers(defaults, o.answers);
    const sectionIndex =
      typeof o.sectionIndex === 'number' &&
      o.sectionIndex >= 0 &&
      o.sectionIndex <= 1
        ? o.sectionIndex
        : 0;
    const q2Other = typeof o.q2Other === 'string' ? o.q2Other : '';
    return { answers, sectionIndex, q2Other };
  } catch {
    return null;
  }
}

export function saveOnboardingDraft(draft: Omit<OnboardingDraft, 'version'>): void {
  if (!canUseSessionStorage()) return;
  try {
    const payload: OnboardingDraft = {
      version: DRAFT_VERSION,
      answers: draft.answers,
      sectionIndex: draft.sectionIndex,
      q2Other: draft.q2Other,
    };
    sessionStorage.setItem(ONBOARDING_DRAFT_KEY, JSON.stringify(payload));
  } catch {
    /* private mode / quota */
  }
}

export function clearOnboardingDraft(): void {
  if (!canUseSessionStorage()) return;
  try {
    sessionStorage.removeItem(ONBOARDING_DRAFT_KEY);
  } catch {
    /* no-op */
  }
}
