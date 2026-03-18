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

// --- Onboarding ---

export interface OnboardingAnswers {
  q1: { adults: number; kids: number; kidAges?: string[] };
  q2: string[];
  q3: string[];
  q3b: string;
  q4: string[];
  q5: string;
  q6: string;
  q7: string;
  q8: string[];
  q9: string;
  q10: string;
  q11: string;
  q12: string;
  q13?: { days: string[]; note?: string };
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
