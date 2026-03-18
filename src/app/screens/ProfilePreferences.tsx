import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

import { ProfileRowCard, ScreenShell } from "../components/design-system";

const PREFERENCES = [
  { label: "Family", value: "4 people — Kids ages 7 and 10" },
  { label: "Avoid", value: "No shellfish · Mild only (no spice)" },
  { label: "Cook time", value: "Under 30 min on weeknights" },
  { label: "Cuisines you like", value: "American, Mexican, Italian, Asian" },
  { label: "Skill level", value: "Quick and simple" },
];

export function ProfilePreferences() {
  const navigate = useNavigate();

  return (
    <ScreenShell>
      <div className="flex items-center justify-center relative pt-12 pb-6">
        <button
          onClick={() => navigate("/home")}
          className="absolute left-page"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-[17px] text-foreground font-semibold">
          Your Family Profile
        </h1>
      </div>

      <div className="mb-4">
        <p className="text-[14px] text-muted-foreground font-normal leading-[1.5]">
          This is what Melu knows about your family. Tap any section to update.
        </p>
      </div>

      <div className="space-y-2.5">
        {PREFERENCES.map((pref, index) => (
          <ProfileRowCard
            key={index}
            label={pref.label}
            value={pref.value}
          />
        ))}
      </div>

      <div className="mb-6 text-center">
        <p className="text-[13px] text-muted-foreground font-normal leading-[1.5]">
          Melu learns from every plan you approve. You can also edit anything above.
        </p>
      </div>

      <div className="text-center mt-8 pb-8">
        <button className="text-[14px] text-muted-foreground font-normal">
          Reset profile
        </button>
      </div>
    </ScreenShell>
  );
}