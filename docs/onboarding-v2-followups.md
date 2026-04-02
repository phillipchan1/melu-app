# Onboarding v2 — follow-up work

1. **Weekly Check-In — nights that need meals** — Move “which nights need dinner” from any legacy flow into [`WeeklyCheckIn.tsx`](../src/app/screens/WeeklyCheckIn.tsx) and thread that context into `/api/plan/generate` when the API accepts weekly overrides.

2. **Supabase `rotation` table** — Persist rotation as first-class rows (seed from `onboarding_answers.q7` on submit, sync on edits) per product spec; MVP stores rotation only in `profiles.onboarding_answers`.

3. **Plan generation — rotation slots** — Tighten [`planGeneration.js`](../../melu-middleware/src/prompts/planGeneration.js) so the model reliably places **2–3** dinners from the user’s rotation list each week, then fills discovery slots from the Chef Card profile.
