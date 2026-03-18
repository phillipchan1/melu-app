const BASE_URL = import.meta.env.VITE_MIDDLEWARE_URL ?? 'http://localhost:3000';

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
