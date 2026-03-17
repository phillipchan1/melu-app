import { ArrowLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";

export function ProfilePreferences() {
  const navigate = useNavigate();

  const preferences = [
    {
      label: "Family",
      value: "4 people — Kids ages 7 and 10",
    },
    {
      label: "Avoid",
      value: "No shellfish · Mild only (no spice)",
    },
    {
      label: "Cook time",
      value: "Under 30 min on weeknights",
    },
    {
      label: "Cuisines you like",
      value: "American, Mexican, Italian, Asian",
    },
    {
      label: "Skill level",
      value: "Quick and simple",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] max-w-[375px] mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-center relative px-5 pt-12 pb-6">
        <button
          onClick={() => navigate("/home")}
          className="absolute left-5"
        >
          <ArrowLeft className="w-6 h-6 text-[#1C1917]" />
        </button>
        <h1 className="text-[17px] text-[#1C1917]" style={{ fontWeight: 600 }}>
          Your Family Profile
        </h1>
      </div>

      {/* Framing Text */}
      <div className="px-5 mb-4">
        <p className="text-[14px] text-[#78716C]" style={{ fontWeight: 400, lineHeight: 1.5 }}>
          This is what Melu knows about your family. Tap any section to update.
        </p>
      </div>

      {/* Preference Cards */}
      <div className="px-5 space-y-2.5">
        {preferences.map((pref, index) => (
          <button
            key={index}
            className="w-full bg-white rounded-2xl p-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex items-center justify-between hover:bg-[#FAF8F5] transition-colors"
          >
            <div className="flex-1 text-left">
              <div className="text-[15px] text-[#1C1917] mb-1" style={{ fontWeight: 600 }}>
                {pref.label}
              </div>
              <div className="text-[15px] text-[#78716C]" style={{ fontWeight: 400 }}>
                {pref.value}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#78716C] flex-shrink-0 ml-3" />
          </button>
        ))}
      </div>

      {/* Footer Note */}
      <div className="px-5 mb-6 text-center">
        <p className="text-[13px] text-[#78716C]" style={{ fontWeight: 400, lineHeight: 1.5 }}>
          Melu learns from every plan you approve. You can also edit anything above.
        </p>
      </div>

      {/* Destructive Action */}
      <div className="text-center mt-8 pb-8">
        <button className="text-[14px] text-[#78716C]" style={{ fontWeight: 400 }}>
          Reset profile
        </button>
      </div>
    </div>
  );
}