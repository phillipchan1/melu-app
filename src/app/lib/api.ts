import { supabase } from './supabase';

const BASE_URL = import.meta.env.VITE_MIDDLEWARE_URL ?? 'http://localhost:3000';

async function getAuthHeaders(): Promise<HeadersInit> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) {
      headers.Authorization = `Bearer ${data.session.access_token}`;
    }
  }
  return headers;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ExtractedProfile {
  dietaryPreferences: string[];
  allergies: string[];
  dislikedIngredients: string[];
  preferredCuisines: string[];
  householdNotes: string[];
  goals: string[];
}

export interface PersonalizationData {
  message: string;
  extractedProfile: ExtractedProfile;
  nextStep: string;
  done: boolean;
}

export interface PersonalizationResponse {
  ok: boolean;
  provider: string;
  agent: string;
  data: PersonalizationData;
}

export async function sendPersonalizationMessage(
  messages: ChatMessage[],
  profile: Record<string, unknown> = {},
  context: Record<string, unknown> = {},
): Promise<PersonalizationData> {
  const response = await fetch(`${BASE_URL}/api/personalization/respond`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, profile, context }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const body: PersonalizationResponse = await response.json();
  return body.data;
}

// --- Onboarding (v2: nine questions, two sections) ---

/** One dinner staple (Q7); from meal library or custom. */
export interface Staple {
  id: string;
  name: string;
  cuisine: string;
  complexityTier?: 'simple' | 'moderate' | 'complex';
  custom?: boolean;
  /** Library catalog id when the row came from the meal library or DB round-trip. */
  libraryMealId?: string;
}

/** @deprecated Use Staple */
export type RotationMeal = Staple;

export interface OnboardingAnswers {
  q1: { adults: number; kids: number; kidAges?: string[] };
  q2: string[];
  q3: string[];
  /** Q4 — nutrition priority */
  q4: string;
  /** Q5 — equipment */
  q5: string[];
  /** Q6 — weeknight cook time */
  q6: string;
  /** Q7 — dinner staples (canonical) */
  staples: Staple[];
  /** Q8 — aspiration (only free-text question) */
  q8: string;
  /** Q9 — adventure dial 1–5 */
  q9: string;
}

export interface ChefCardComparison {
  name: string;
  desc: string;
  match: number;
}

export interface ChefCard {
  buildName: string;
  overallScore: number;
  tagline: string;
  comparisons: ChefCardComparison[];
  dimensionScores: Record<string, number>;
  cuisineTags: string[];
}

export interface OnboardingSubmitResponse {
  ok: boolean;
  chefCard: ChefCard;
  profile: Record<string, unknown>;
}

export async function submitOnboarding(answers: OnboardingAnswers): Promise<OnboardingSubmitResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/onboarding/submit`, {
    method: 'POST',
    headers,
    body: JSON.stringify(answers),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.error ?? `API error: ${response.status}`);
  }

  return response.json();
}

export interface FetchChefCardResponse {
  ok: boolean;
  chefCard: ChefCard;
}

// --- Plan Generation ---

export interface Meal {
  day: string;
  name: string;
  description: string;
  cookTime: number;
  servings: number;
  cuisine: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: string[];
  reasonTag: string;
}

export interface Plan {
  id: string;
  weekStart: string;
  meals: Meal[];
}

export interface GeneratePlanResponse {
  success: boolean;
  plan: Plan;
}

export async function generatePlan(): Promise<Plan> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/plan/generate`, {
    method: 'POST',
    headers,
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.error ?? errBody.details ?? `API error: ${response.status}`);
  }

  const data: GeneratePlanResponse = await response.json();
  return data.plan;
}

export async function fetchChefCard(): Promise<ChefCard | null> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/profile/chef-card`, {
    method: 'GET',
    headers,
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data: FetchChefCardResponse = await response.json();
  return data.chefCard ?? null;
}

export interface StaplesListResponse {
  ok: boolean;
  staples: Staple[];
}

export async function fetchStaples(): Promise<Staple[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/staples`, {
    method: 'GET',
    headers,
  });
  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.error ?? `API error: ${response.status}`);
  }
  const data: StaplesListResponse = await response.json();
  return data.staples ?? [];
}

export async function replaceStaples(staples: Staple[]): Promise<Staple[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/staples`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ staples }),
  });
  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.error ?? `API error: ${response.status}`);
  }
  const data: StaplesListResponse = await response.json();
  return data.staples ?? [];
}
