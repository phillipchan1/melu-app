import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { OnboardingProgressBar } from "../components/OnboardingProgressBar";
import { MealSelector, StaplesSearchOverlay } from "../components/StaplesSearchOverlay";
import { type OnboardingAnswers, type Staple, submitOnboarding } from "../lib/api";
import {
  clearOnboardingDraft,
  loadOnboardingDraft,
  saveOnboardingDraft,
} from "../lib/onboardingDraft";

/** Shown under "Step 1 of 3" only; steps 2–3 use no step-indicator subtitle. */
const STEP_1_INDICATOR_SUBTITLE = "Basic info";

const SECTIONS = [
  {
    id: "kitchen" as const,
    kicker: "First up",
    headline: "Let's get the basics down",
    subtitle: "Household, diet, and what you can really cook on a weeknight.",
  },
  {
    id: "staples" as const,
    kicker: "Next up",
    headline: "What does your family already love?",
    subtitle: "These anchor every plan.",
  },
] as const;

const Q2_OPTIONS = [
  { value: "peanuts", label: "Peanuts" },
  { value: "tree_nuts", label: "Tree nuts" },
  { value: "dairy", label: "Dairy" },
  { value: "gluten", label: "Gluten" },
  { value: "shellfish", label: "Shellfish" },
  { value: "eggs", label: "Eggs" },
  { value: "soy", label: "Soy" },
];

const Q3_OPTIONS = [
  { value: "halal", label: "Halal" },
  { value: "kosher", label: "Kosher" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten_free", label: "Gluten-free" },
  { value: "low_carb", label: "Low-carb" },
  { value: "low_sodium", label: "Low-sodium" },
];

const Q4_OPTIONS = [
  { value: "just_dinner", label: "It's just dinner" },
  { value: "balanced", label: "We try to be balanced" },
  { value: "priority", label: "It's a real priority" },
  { value: "non_negotiable", label: "It's non-negotiable" },
];

const Q5_OPTIONS = [
  { value: "oven", label: "Oven" },
  { value: "stovetop", label: "Stovetop" },
  { value: "air_fryer", label: "Air fryer" },
  { value: "instant_pot", label: "Instant pot" },
  { value: "slow_cooker", label: "Slow cooker" },
  { value: "grill", label: "Grill" },
  { value: "microwave_only", label: "Microwave" },
];

const Q6_OPTIONS = [
  { value: "under_20", label: "Under 20 min" },
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60_plus", label: "60+ min" },
];

/** Pace dial: value 1–5 left to right */
const PACE_OPTIONS = [
  { value: 1, label: "Keep it familiar" },
  { value: 2, label: "Mostly familiar" },
  { value: 3, label: "Mix it up" },
  { value: 4, label: "Push a little" },
  { value: 5, label: "Surprise us" },
] as const;

const KID_AGE_OPTIONS = ["toddler", "elementary", "teen"];

const defaultAnswers: OnboardingAnswers = {
  q1: { adults: 2, kids: 0, kidAges: [] },
  q2: [],
  q3: [],
  q4: "",
  q5: [],
  q6: "",
  staples: [],
  aspirations: [],
  discoveryPace: 2,
};

function MultiSelect({
  options,
  value,
  onChange,
}: Readonly<{
  options: { value: string; label: string }[];
  value: string[];
  onChange: (v: string[]) => void;
}>) {
  const toggle = (v: string) => {
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else onChange([...value, v]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => toggle(o.value)}
          className={`rounded-full px-4 py-2.5 text-[15px] transition-colors ${
            value.includes(o.value)
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-foreground hover:bg-border"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function SingleSelect({
  options,
  value,
  onChange,
}: Readonly<{
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}>) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded-full px-5 py-3 text-left text-[15px] transition-colors ${
            value === o.value ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-border"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: Readonly<{
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}>) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[15px] text-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center disabled:opacity-40"
        >
          −
        </button>
        <span className="text-[17px] font-medium w-8 text-center">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}

type BasicInfoSummaryRow = { id: string; label: string; value: string };

function optionLabel(options: readonly { value: string; label: string }[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

function formatKidAgeChip(age: string): string {
  if (age === "toddler") return "Toddler";
  if (age === "elementary") return "Elementary";
  if (age === "teen") return "Teen";
  return age.charAt(0).toUpperCase() + age.slice(1);
}

function buildStep1SummaryRows(answers: OnboardingAnswers, q2OtherTrimmed: string): BasicInfoSummaryRow[] {
  const rows: BasicInfoSummaryRow[] = [];
  const { adults, kids, kidAges = [] } = answers.q1;

  const showCooking = adults !== 2 || kids !== 0 || kidAges.length > 0;

  if (showCooking) {
    rows.push({
      id: "cooking",
      label: "Cooking for",
      value: `${adults} adults, ${kids} kids`,
    });
  }

  if (kids > 0 && kidAges.length > 0) {
    rows.push({
      id: "kids",
      label: "Kids",
      value: kidAges.map(formatKidAgeChip).join(", "),
    });
  }

  const allergyParts = [
    ...answers.q2.map((v) => optionLabel(Q2_OPTIONS, v)),
    ...(q2OtherTrimmed ? [q2OtherTrimmed] : []),
  ];
  if (allergyParts.length > 0) {
    rows.push({
      id: "allergies",
      label: "Allergies",
      value: allergyParts.join(", "),
    });
  }

  if (answers.q3.length > 0) {
    rows.push({
      id: "diet",
      label: "Diet",
      value: answers.q3.map((v) => optionLabel(Q3_OPTIONS, v)).join(", "),
    });
  }

  if (answers.q4) {
    rows.push({
      id: "nutrition",
      label: "Nutrition",
      value: optionLabel(Q4_OPTIONS, answers.q4),
    });
  }

  if (answers.q5.length > 0) {
    rows.push({
      id: "kitchen",
      label: "Kitchen",
      value: answers.q5.map((v) => optionLabel(Q5_OPTIONS, v)).join(", "),
    });
  }

  if (answers.q6) {
    rows.push({
      id: "time",
      label: "Time limit",
      value: optionLabel(Q6_OPTIONS, answers.q6),
    });
  }

  return rows;
}

/** Same rules as Next enablement on step 1 — must stay in sync with `canProceed` for section 0. */
function isStep1FormComplete(answers: OnboardingAnswers): boolean {
  return answers.q1.adults >= 1 && !!answers.q4 && answers.q5.length > 0 && !!answers.q6;
}

function Step1MeluLearningPanel({ rows }: Readonly<{ rows: BasicInfoSummaryRow[] }>) {
  const isEmpty = rows.length === 0;

  return (
    <aside
      className="hidden md:flex md:flex-col md:w-[320px] md:shrink-0 md:sticky md:top-20 md:self-start md:rounded-2xl md:border md:border-border md:bg-card md:p-6"
      aria-live="polite"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-4">
        What Melu is learning
      </p>
      {isEmpty ? (
        <p className="text-center text-[14px] italic text-muted-foreground leading-relaxed">
          Fill in your details and
          <br />
          Melu will start learning.
        </p>
      ) : (
        <ul className="flex flex-col list-none p-0 m-0">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex justify-between items-start gap-3 border-b border-border/80 py-2 text-[14px] animate-in fade-in duration-200"
            >
              <span className="shrink-0 text-muted-foreground mr-3">{row.label}</span>
              <span className="min-w-0 text-right text-foreground">{row.value}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

function getInitialOnboardingState() {
  const draft = loadOnboardingDraft(defaultAnswers);
  if (!draft) {
    return {
      answers: defaultAnswers,
      sectionIndex: 0,
      q2Other: "",
    };
  }
  return {
    answers: draft.answers,
    sectionIndex: draft.sectionIndex,
    q2Other: draft.q2Other,
  };
}

function pathToSectionIndex(pathname: string): number {
  const parts = pathname.split("/").filter(Boolean);
  const last = parts.at(-1);
  if (last === "aspirations" || last === "goals") return 2;
  if (last === "staples") return 1;
  return 0;
}

export function ProfileSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const initial = useMemo(() => getInitialOnboardingState(), []);
  const [answers, setAnswers] = useState<OnboardingAnswers>(initial.answers);
  const sectionIndex = pathToSectionIndex(location.pathname);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [q2Other, setQ2Other] = useState(initial.q2Other);

  useEffect(() => {
    saveOnboardingDraft({ answers, sectionIndex, q2Other });
  }, [answers, sectionIndex, q2Other]);

  const section = SECTIONS[sectionIndex] ?? SECTIONS[0];
  const isLastSection = sectionIndex === 2;

  const update = <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    if (sectionIndex === 0) {
      return isStep1FormComplete(answers);
    }
    if (sectionIndex === 1) {
      return answers.staples.length >= 1;
    }
    if (sectionIndex === 2) {
      return answers.discoveryPace >= 1 && answers.discoveryPace <= 5;
    }
    return true;
  };

  const getNextButtonLabel = () => {
    if (isSubmitting) return "Creating your card...";
    if (isLastSection) return "See my Chef Card";
    if (sectionIndex === 1) return "Continue";
    return "Next";
  };

  const handleNext = () => {
    if (isLastSection) {
      void handleSubmit();
      return;
    }
    if (sectionIndex === 0) {
      saveOnboardingDraft({ answers, sectionIndex: 1, q2Other });
      navigate("/onboarding/staples");
      return;
    }
    if (sectionIndex === 1) {
      saveOnboardingDraft({ answers, sectionIndex: 2, q2Other });
      navigate("/onboarding/aspirations");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    const payload: OnboardingAnswers = {
      ...answers,
      q2: [...answers.q2, ...(q2Other.trim() ? [q2Other.trim()] : [])],
    };
    try {
      await submitOnboarding(payload);
      clearOnboardingDraft();
      navigate("/onboarding/complete");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStaplesConfirmed = (items: Staple[]) => {
    const nextAnswers = { ...answers, staples: items };
    setAnswers(nextAnswers);
    saveOnboardingDraft({ answers: nextAnswers, sectionIndex: 2, q2Other });
    navigate("/onboarding/aspirations");
  };

  const handleAspirationsConfirmed = (items: Staple[]) => {
    update("aspirations", items);
  };

  const stepNumber = sectionIndex + 1;
  const wideOnboardingStep = sectionIndex === 1 || sectionIndex === 2;
  /** Step 1 content uses 960px; bottom bar matches staples/aspirations (1200 cap) on desktop. */
  const wideDesktopBottomBar = sectionIndex === 0 || wideOnboardingStep;

  const step1SummaryRows = useMemo(
    () => buildStep1SummaryRows(answers, q2Other.trim()),
    [answers, q2Other],
  );

  return (
    <div
      className={`min-h-screen bg-background flex flex-col mx-auto ${
        sectionIndex === 0
          ? "max-w-[375px] md:max-w-[960px]"
          : wideOnboardingStep
            ? "max-w-[375px] md:max-w-[min(100%,1200px)]"
            : "max-w-[375px]"
      }`}
    >
      <div className="pt-12 pb-6 px-page text-center">
        <div className="text-[22px] text-primary font-semibold">
          melu
        </div>
        <OnboardingProgressBar currentStep={stepNumber} totalSteps={3} />
        <div className="text-[13px] text-muted-foreground">
          Step {stepNumber} of 3
        </div>
        {sectionIndex === 0 ? (
          <div className="text-[15px] text-foreground font-medium mt-1">{STEP_1_INDICATOR_SUBTITLE}</div>
        ) : null}
      </div>

      <div
        className={`flex-1 pb-32 min-h-0 ${
          sectionIndex === 0 ? "px-page md:px-8" : "px-page"
        } ${sectionIndex === 1 || sectionIndex === 2 ? "flex flex-col overflow-hidden" : "overflow-y-auto"}`}
      >
        {sectionIndex < 2 && sectionIndex !== 1 && (
          <>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-1">
              {section.kicker}
            </p>
            <h2 className="text-[20px] text-foreground mb-2 font-semibold leading-snug">{section.headline}</h2>
            <p className="text-[14px] text-muted-foreground mb-6 leading-relaxed">{section.subtitle}</p>
          </>
        )}

        {sectionIndex === 1 && (
          <>
            <h2 className="text-[20px] text-foreground mb-2 font-semibold leading-snug">{section.headline}</h2>
            <p className="text-[14px] text-muted-foreground mb-4 leading-relaxed">{section.subtitle}</p>
            <StaplesSearchOverlay
              embedded
              open
              onOpenChange={() => {}}
              selected={answers.staples}
              onSelectionChange={(items) => update("staples", items)}
              onConfirm={handleStaplesConfirmed}
              mode="staples"
            />
          </>
        )}

        {sectionIndex === 0 && (
          <div className="md:grid md:grid-cols-[1fr_320px] md:gap-12 md:items-start md:min-w-0">
            <div className="space-y-8 min-w-0">
              <div>
                <p className="text-[15px] text-foreground mb-3">Who are you feeding?</p>
                <div className="space-y-4 bg-card rounded-2xl p-5 shadow-sm">
                  <Stepper
                    label="Adults"
                    value={answers.q1.adults}
                    min={1}
                    max={8}
                    onChange={(v) => update("q1", { ...answers.q1, adults: v })}
                  />
                  <Stepper
                    label="Kids"
                    value={answers.q1.kids}
                    min={0}
                    max={8}
                    onChange={(v) => update("q1", { ...answers.q1, kids: v })}
                  />
                  {answers.q1.kids > 0 && (
                    <div>
                      <p className="text-[14px] text-muted-foreground mb-2">Kid ages (optional)</p>
                      <MultiSelect
                        options={KID_AGE_OPTIONS.map((a) => ({ value: a, label: a }))}
                        value={answers.q1.kidAges || []}
                        onChange={(v) => update("q1", { ...answers.q1, kidAges: v })}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[15px] text-foreground mb-3">Any allergies or intolerances?</p>
                <MultiSelect options={Q2_OPTIONS} value={answers.q2} onChange={(v) => update("q2", v)} />
                <input
                  type="text"
                  placeholder="Other (e.g. sesame)"
                  value={q2Other}
                  onChange={(e) => setQ2Other(e.target.value)}
                  className="mt-3 w-full bg-secondary rounded-full px-4 py-3 text-[15px] placeholder:text-muted-foreground outline-none border border-border"
                />
              </div>

              <div>
                <p className="text-[15px] text-foreground mb-3">Any dietary restrictions?</p>
                <MultiSelect options={Q3_OPTIONS} value={answers.q3} onChange={(v) => update("q3", v)} />
              </div>

              <div>
                <p className="text-[15px] text-foreground mb-3">
                  How much does nutrition factor into what you cook?
                </p>
                <SingleSelect options={Q4_OPTIONS} value={answers.q4} onChange={(v) => update("q4", v)} />
              </div>

              <div>
                <p className="text-[15px] text-foreground mb-3">What&apos;s in your kitchen?</p>
                <MultiSelect options={Q5_OPTIONS} value={answers.q5} onChange={(v) => update("q5", v)} />
              </div>

              <div>
                <p className="text-[15px] text-foreground mb-3">
                  On a typical weeknight, how much time do you actually have to cook?
                </p>
                <SingleSelect options={Q6_OPTIONS} value={answers.q6} onChange={(v) => update("q6", v)} />
              </div>
            </div>
            <Step1MeluLearningPanel rows={step1SummaryRows} />
          </div>
        )}

        {sectionIndex === 2 && (
          <div className="space-y-10 flex flex-col flex-1 min-h-0">
            <div className="flex flex-col flex-1 min-h-0">
              <h2 className="text-[20px] text-foreground mb-2 font-semibold leading-snug">
                Dream a little.
              </h2>
              <p className="text-[14px] text-muted-foreground mb-4 leading-relaxed">
                Pick meals you want to learn — Melu will get you there.
              </p>
              <MealSelector
                embedded
                open
                onOpenChange={() => {}}
                mode="aspirations"
                rotationStaples={answers.staples}
                selected={answers.aspirations}
                onSelectionChange={(items) => update("aspirations", items)}
                onConfirm={handleAspirationsConfirmed}
              />
            </div>

            <div className="border-t border-border pt-8 shrink-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-1">
                Your pace
              </p>
              <p className="text-[15px] text-foreground mb-1 font-medium">How fast do you want to get there?</p>
              <p className="text-[14px] text-muted-foreground mb-4 leading-relaxed">
                This controls how often Melu introduces something new vs. sticking to what you know.
              </p>
              <div className="flex flex-row gap-2 w-full">
                {PACE_OPTIONS.map((o) => {
                  const selected = answers.discoveryPace === o.value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => update("discoveryPace", o.value)}
                      className={`flex-1 min-w-0 rounded-xl px-2 py-3 text-center text-[13px] leading-[1.3] font-medium cursor-pointer transition-colors ${
                        selected ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground border border-border"
                      }`}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-4 text-[14px] text-red-500 text-center">{error}</p>
        )}
      </div>

      <div
        className={`fixed bottom-0 left-0 right-0 bg-background border-t border-border px-page py-4 mx-auto flex items-center justify-between ${
          wideDesktopBottomBar ? "max-w-[375px] md:max-w-[min(100%,1200px)]" : "max-w-[375px]"
        }`}
      >
        <button
          type="button"
          onClick={() => {
            if (sectionIndex === 2) {
              saveOnboardingDraft({ answers, sectionIndex: 1, q2Other });
              navigate("/onboarding/staples");
            } else if (sectionIndex === 1) {
              saveOnboardingDraft({ answers, sectionIndex: 0, q2Other });
              navigate("/onboarding");
            }
          }}
          disabled={sectionIndex === 0}
          className="flex items-center gap-1 text-muted-foreground disabled:opacity-40"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed() || isSubmitting}
          className="flex items-center gap-1 bg-primary text-primary-foreground px-6 py-3 rounded-full disabled:opacity-40"
        >
          {getNextButtonLabel()}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
