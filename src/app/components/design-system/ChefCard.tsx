import type { ChefCard as ChefCardType } from "../../lib/api";

const DIMENSION_LABELS: Record<string, string> = {
  Comfort: "Comfort",
  Speed: "Speed",
  Boldness: "Boldness",
  Discovery: "Discovery",
  Nourishment: "Nourishment",
};

interface ChefCardProps {
  card: ChefCardType;
}

function ChefCard({ card }: ChefCardProps) {
  const dimensions = ["Comfort", "Speed", "Boldness", "Discovery", "Nourishment"];

  return (
    <div className="w-full max-w-[340px] bg-card rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
      <div className="bg-primary px-5 py-6 text-center">
        <h2 className="text-[20px] text-primary-foreground font-semibold">
          {card.buildName}
        </h2>
        <p className="text-[14px] text-primary-foreground/90 mt-1">{card.tagline}</p>
        <div className="mt-3 flex justify-center gap-2 flex-wrap">
          {card.cuisineTags.map((tag) => (
            <span
              key={tag}
              className="bg-primary-foreground/20 rounded-full px-3 py-1 text-[12px] text-primary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="px-5 py-4 space-y-3">
        {card.comparisons.map((c) => (
          <div
            key={`${c.name}-${c.match}`}
            className="flex items-center justify-between gap-3"
          >
            <div>
              <p className="text-[14px] font-medium text-foreground">{c.name}</p>
              <p className="text-[12px] text-muted-foreground">{c.desc}</p>
            </div>
            <span className="text-[14px] font-medium text-primary shrink-0">
              {c.match}%
            </span>
          </div>
        ))}
      </div>
      <div className="px-5 pb-5 pt-2 border-t border-border">
        <p className="text-[12px] text-muted-foreground mb-2">Your profile</p>
        <div className="space-y-2">
          {dimensions.map((dim) => {
            const score = card.dimensionScores[dim] ?? 50;
            return (
              <div key={dim} className="flex items-center gap-2">
                <span className="text-[12px] text-foreground w-24">
                  {DIMENSION_LABELS[dim]}
                </span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground w-6">
                  {score}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { ChefCard };
