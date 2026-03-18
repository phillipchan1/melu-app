import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { type OnboardingAnswers, submitOnboarding } from "../lib/api";

const SECTIONS = [
  { id: "kitchen", title: "Your Kitchen", step: 1 },
  { id: "palate", title: "Your Palate", step: 2 },
  { id: "reality", title: "Your Reality", step: 3 },
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

const Q3B_OPTIONS = [
  { value: "just_dinner", label: "It's just dinner" },
  { value: "balanced", label: "We try to be balanced" },
  { value: "priority", label: "It's a real priority" },
  { value: "non_negotiable", label: "It's non-negotiable" },
];

const Q4_OPTIONS = [
  { value: "oven", label: "Oven" },
  { value: "stovetop", label: "Stovetop" },
  { value: "air_fryer", label: "Air fryer" },
  { value: "instant_pot", label: "Instant pot" },
  { value: "slow_cooker", label: "Slow cooker" },
  { value: "grill", label: "Grill" },
  { value: "microwave_only", label: "Microwave only" },
];

const Q5_OPTIONS = [
  { value: "under_20", label: "Under 20 min" },
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60_plus", label: "60+ min" },
];

const Q8_OPTIONS = [
  { value: "bold_spicy", label: "Bold & spicy" },
  { value: "rich_savory", label: "Rich & savory" },
  { value: "bright_fresh", label: "Bright & fresh" },
  { value: "light_healthy", label: "Light & healthy" },
  { value: "sweet_comforting", label: "Sweet & comforting" },
  { value: "umami_forward", label: "Umami-forward" },
];

const Q9_OPTIONS = [
  { value: "1", label: "Stick to what we know" },
  { value: "2", label: "Mostly familiar" },
  { value: "3", label: "Mix it up" },
  { value: "4", label: "Push us a little" },
  { value: "5", label: "Surprise us" },
];

const Q12_OPTIONS = [
  { value: "trying_new", label: "Trying new things" },
  { value: "nailing_meals", label: "Nailing meals we already know" },
  { value: "both", label: "Both equally" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const KID_AGE_OPTIONS = ["toddler", "elementary", "teen"];

const defaultAnswers: OnboardingAnswers = {
  q1: { adults: 2, kids: 0, kidAges: [] },
  q2: [],
  q3: [],
  q3b: "",
  q4: [],
  q5: "",
  q6: "",
  q7: "",
  q8: [],
  q9: "",
  q10: "",
  q11: "",
  q12: "",
  q13: { days: [], note: "" },
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

export function ProfileSetup() {
  const navigate = useNavigate();
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>(defaultAnswers);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [q2Other, setQ2Other] = useState("");

  const section = SECTIONS[sectionIndex];
  const isLastSection = sectionIndex === SECTIONS.length - 1;

  const update = <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    if (section.id === "kitchen") {
      return (
        answers.q1.adults >= 1 &&
        answers.q3b &&
        answers.q4.length > 0 &&
        answers.q5
      );
    }
    if (section.id === "palate") {
      return answers.q6.trim().length > 0 && answers.q8.length > 0 && answers.q9;
    }
    if (section.id === "reality") {
      return answers.q11.trim().length > 0 && answers.q12;
    }
    return true;
  };

  const getNextButtonLabel = () => {
    if (isSubmitting) return "Creating your card...";
    if (isLastSection) return "See my Chef Card";
    return "Next";
  };

  const handleNext = () => {
    if (isLastSection) {
      handleSubmit();
    } else {
      setSectionIndex((i) => i + 1);
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
      const res = await submitOnboarding(payload);
      navigate("/onboarding-transition", { state: { chefCard: res.chefCard } });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-[375px] mx-auto">
      <div className="pt-12 pb-6 px-page text-center">
        <div className="text-[22px] text-primary font-semibold">
          melu
        </div>
        <div className="text-[13px] text-muted-foreground mt-1">
          Step {section.step} of 4
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-page pb-32">
        <h2 className="text-[17px] text-foreground mb-6 font-semibold">
          {section.title}
        </h2>

        {section.id === "kitchen" && (
          <div className="space-y-8">
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
              <SingleSelect options={Q3B_OPTIONS} value={answers.q3b} onChange={(v) => update("q3b", v)} />
            </div>

            <div>
              <p className="text-[15px] text-foreground mb-3">What&apos;s in your kitchen?</p>
              <MultiSelect options={Q4_OPTIONS} value={answers.q4} onChange={(v) => update("q4", v)} />
            </div>

            <div>
              <p className="text-[15px] text-foreground mb-3">
                On a typical weeknight, how much time do you actually have to cook?
              </p>
              <SingleSelect options={Q5_OPTIONS} value={answers.q5} onChange={(v) => update("q5", v)} />
            </div>
          </div>
        )}

        {section.id === "palate" && (
          <div className="space-y-8">
            <div>
              <p className="text-[15px] text-foreground mb-3">
                Name 3–5 dinners your family already loves.
              </p>
              <input
                type="text"
                placeholder="Tacos, spaghetti, grilled chicken..."
                value={answers.q6}
                onChange={(e) => update("q6", e.target.value)}
                className="w-full bg-secondary rounded-2xl px-4 py-3 text-[15px] placeholder:text-muted-foreground outline-none border border-border"
              />
            </div>

            <div>
              <p className="text-[15px] text-foreground mb-3">
                What&apos;s one thing you&apos;ve always wanted to cook but never have?
              </p>
              <input
                type="text"
                placeholder="Thai curry, homemade ramen, beef Wellington..."
                value={answers.q7}
                onChange={(e) => update("q7", e.target.value)}
                className="w-full bg-secondary rounded-2xl px-4 py-3 text-[15px] placeholder:text-muted-foreground outline-none border border-border"
              />
            </div>

            <div>
              <p className="text-[15px] text-foreground mb-3">Pick the flavors that feel like home.</p>
              <MultiSelect options={Q8_OPTIONS} value={answers.q8} onChange={(v) => update("q8", v)} />
            </div>

            <div>
              <p className="text-[15px] text-foreground mb-3">
                How adventurous do you want your plan to be?
              </p>
              <SingleSelect options={Q9_OPTIONS} value={answers.q9} onChange={(v) => update("q9", v)} />
            </div>

            <div>
              <p className="text-[15px] text-foreground mb-3">
                Anything your family absolutely will not eat?
              </p>
              <input
                type="text"
                placeholder="Mushrooms, fish, anything too spicy..."
                value={answers.q10}
                onChange={(e) => update("q10", e.target.value)}
                className="w-full bg-secondary rounded-2xl px-4 py-3 text-[15px] placeholder:text-muted-foreground outline-none border border-border"
              />
            </div>

          </div>
        )}

        {section.id === "reality" && (
          <div className="space-y-8">
            <div>
              <p className="text-[15px] text-foreground mb-3">
                On a chaos night — soccer, long day, everyone&apos;s tired — what dish do you actually
                make or grab?
              </p>
              <input
                type="text"
                placeholder="e.g. cereal, takeout pizza, scrambled eggs..."
                value={answers.q11}
                onChange={(e) => update("q11", e.target.value)}
                className="w-full bg-secondary rounded-2xl px-4 py-3 text-[15px] placeholder:text-muted-foreground outline-none border border-border"
              />
            </div>

            <div>
              <p className="text-[15px] text-foreground mb-3">What matters more to you right now?</p>
              <SingleSelect options={Q12_OPTIONS} value={answers.q12} onChange={(v) => update("q12", v)} />
            </div>

            <div>
              <p className="text-[15px] text-foreground mb-3">Are any nights off-limits? (optional)</p>
              <MultiSelect
                options={DAYS.map((d) => ({ value: d.toLowerCase(), label: d }))}
                value={answers.q13?.days || []}
                onChange={(v) => update("q13", { ...answers.q13!, days: v })}
              />
              <input
                type="text"
                placeholder="e.g. Friday — pizza night"
                value={answers.q13?.note || ""}
                onChange={(e) => update("q13", { ...answers.q13!, note: e.target.value })}
                className="mt-3 w-full bg-secondary rounded-full px-4 py-3 text-[15px] placeholder:text-muted-foreground outline-none border border-border"
              />
            </div>
          </div>
        )}

        {error && (
          <p className="mt-4 text-[14px] text-red-500 text-center">{error}</p>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-page py-4 max-w-[375px] mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={() => setSectionIndex((i) => Math.max(0, i - 1))}
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
