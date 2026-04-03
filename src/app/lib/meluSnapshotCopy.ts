import type { OnboardingAnswers } from "./api";

const cookTimeMap: Record<string, string> = {
  under_20: "under 20 minutes",
  "30": "about 30 minutes",
  "45": "up to 45 minutes",
  "60_plus": "an hour or more",
};

/** Cook time label for FAMILY DETAILS row (short form). */
export function cookTimeDetailLabel(q6: string): string {
  const map: Record<string, string> = {
    under_20: "Under 20 min",
    "30": "About 30 min",
    "45": "Up to 45 min",
    "60_plus": "60+ min",
  };
  return map[q6] ?? "Up to 45 min";
}

export function discoveryPaceLabel(pace: number): string {
  const map: Record<number, string> = {
    1: "Rarely",
    2: "Sometimes",
    3: "Weekly",
    4: "Often",
    5: "Always",
  };
  return map[pace] ?? "Weekly";
}

export function formatFamilyDetailsRow(q1: OnboardingAnswers["q1"]): string {
  const adults = q1?.adults ?? 0;
  const kids = q1?.kids ?? 0;
  const total = adults + kids;
  if (kids > 0 && Array.isArray(q1?.kidAges) && q1.kidAges.length > 0) {
    return `${total} people · Kids ages ${q1.kidAges.join(" and ")}`;
  }
  if (kids > 0) {
    return `${total} people · ${kids} kid${kids > 1 ? "s" : ""}`;
  }
  return `${total} people`;
}

export function formatAvoidDetails(q2: string[], q3: string[]): string {
  const parts = [...(q2 ?? []), ...(q3 ?? [])].map((s) => String(s).trim()).filter(Boolean);
  if (parts.length === 0) return "Nothing off the table";
  return parts.join(", ");
}

export function buildFamilySummary(answers: OnboardingAnswers): string {
  const { q1, q2, q6 } = answers;
  const adults = q1?.adults ?? 0;
  const kids = q1?.kids ?? 0;
  const total = adults + kids;

  const cookTime = cookTimeMap[q6 as string] ?? "about 30 minutes";

  const restrictions =
    Array.isArray(q2) && q2.length > 0 ? `${q2.join(", ")} — off the table entirely.` : null;

  let summary = `A family of ${total}.`;
  if (kids > 0) {
    let agesSuffix: string;
    if (Array.isArray(q1?.kidAges) && q1.kidAges.length > 0) {
      agesSuffix = ` Kids ages ${q1.kidAges.join(" and ")}.`;
    } else {
      agesSuffix = ` ${kids} kid${kids > 1 ? "s" : ""}.`;
    }
    summary += agesSuffix;
  }
  summary += ` Weeknights need to move fast — working with ${cookTime}.`;
  if (restrictions) summary += ` ${restrictions}`;

  return summary;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Best-effort parse of profiles.onboarding_answers JSON into OnboardingAnswers. */
export function parseOnboardingAnswers(raw: unknown): OnboardingAnswers | null {
  if (!isRecord(raw)) return null;
  const q1 = raw.q1;
  if (!isRecord(q1)) return null;
  const adults = Number(q1.adults);
  const kids = Number(q1.kids);
  if (!Number.isFinite(adults) || adults < 0 || !Number.isFinite(kids) || kids < 0) return null;

  const q2 = Array.isArray(raw.q2) ? raw.q2.map(String) : [];
  const q3 = Array.isArray(raw.q3) ? raw.q3.map(String) : [];
  const q4 = typeof raw.q4 === "string" ? raw.q4 : "";
  const q5 = Array.isArray(raw.q5) ? raw.q5.map(String) : [];
  const q6 = typeof raw.q6 === "string" ? raw.q6 : "";
  const staples = Array.isArray(raw.staples) ? raw.staples : [];
  const aspirations = Array.isArray(raw.aspirations) ? raw.aspirations : [];
  const rawPace = Number(raw.discoveryPace);
  const discoveryPace = Number.isFinite(rawPace) && rawPace >= 1 && rawPace <= 5 ? rawPace : 2;

  const kidAges = Array.isArray(q1.kidAges) ? q1.kidAges.map(String) : undefined;

  return {
    q1: { adults, kids, ...(kidAges && kidAges.length > 0 ? { kidAges } : {}) },
    q2,
    q3,
    q4,
    q5,
    q6,
    staples: staples as OnboardingAnswers["staples"],
    aspirations: aspirations as OnboardingAnswers["aspirations"],
    discoveryPace,
  };
}

export const STILL_LEARNING_ITEMS = [
  "Which nights are usually your hardest",
  "Whether the kids are adventurous or picky eaters",
  "Which staples you actually reach for vs. just said you would",
  "How much variety feels exciting vs. overwhelming",
  "What a great week looks like for your family",
] as const;
