import { useState } from "react";
import type { ChefCard as ChefCardType } from "../../lib/api";

const DIMENSION_LABELS: Record<string, string> = {
  Comfort: "Comfort",
  Speed: "Speed",
  Boldness: "Boldness",
  Discovery: "Discovery",
  Nourishment: "Nourishment",
};

interface ChefCardProps {
  readonly card: ChefCardType;
  /** When true, tagline is hidden (generation failed). */
  readonly chefCardError?: boolean;
}

function ChefCard({ card, chefCardError = false }: Readonly<ChefCardProps>) {
  const dimensions = ["Comfort", "Speed", "Boldness", "Discovery", "Nourishment"];
  const [profileOpen, setProfileOpen] = useState(false);

  const rotationTags =
    card.rotationCuisineTags && card.rotationCuisineTags.length > 0
      ? card.rotationCuisineTags
      : card.cuisineTags;

  const aspirations = card.aspirationMeals ?? [];
  const showTagline = !chefCardError && card.tagline && String(card.tagline).trim().length > 0;

  return (
    <div className="w-full max-w-[340px] bg-card rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
      <div className="bg-primary px-5 py-6 text-center">
        <h2 className="text-[20px] text-primary-foreground font-semibold">{card.buildName}</h2>
        {showTagline ? (
          <p className="text-[14px] text-primary-foreground/90 mt-1 font-normal">{card.tagline}</p>
        ) : null}
        <div className="mt-3 flex justify-center gap-2 flex-wrap">
          {rotationTags.map((tag) => (
            <span
              key={tag}
              className="bg-primary-foreground/20 rounded-full px-3 py-1 text-[12px] text-primary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="px-5 py-4 space-y-3 bg-background">
        {card.comparisons.map((c) => (
          <div
            key={`${c.name}-${c.match}`}
            className="flex items-center justify-between gap-3"
          >
            <div>
              <p className="text-[14px] font-medium text-foreground">{c.name}</p>
              <p className="text-[12px] text-muted-foreground">{c.desc}</p>
            </div>
            <span className="text-[14px] font-medium text-primary shrink-0">{c.match}%</span>
          </div>
        ))}
      </div>

      {aspirations.length > 0 ? (
        <div className="px-5 pb-4 pt-4 border-t border-[#eee] bg-background">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-2.5">
            Working toward
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {aspirations.slice(0, 2).map((name) => (
              <span
                key={name}
                className="inline-flex items-center rounded-[20px] border-[1.5px] border-primary px-[14px] py-1.5 text-[14px] text-primary bg-transparent"
              >
                {name}
              </span>
            ))}
          </div>
          <p className="text-[13px] text-muted-foreground mt-3 italic text-center leading-snug">
            Melu will get you there — one dish at a time.
          </p>
        </div>
      ) : null}

      <div className="px-5 pb-5 pt-2 border-t border-border bg-background">
        <button
          type="button"
          onClick={() => setProfileOpen((o) => !o)}
          className="text-[14px] text-muted-foreground mb-2 w-full text-center underline-offset-2 hover:underline"
          aria-expanded={profileOpen}
        >
          See your full profile ▾
        </button>
        {profileOpen ? (
          <div className="space-y-2">
            {dimensions.map((dim) => {
              const score = card.dimensionScores[dim] ?? 50;
              return (
                <div key={dim} className="flex items-center gap-2">
                  <span className="text-[12px] text-foreground w-24">{DIMENSION_LABELS[dim]}</span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-muted-foreground w-6">{score}</span>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export { ChefCard };
