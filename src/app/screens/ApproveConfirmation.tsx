import { Check } from "lucide-react";
import { useNavigate } from "react-router";

export function ApproveConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-5 max-w-[375px] mx-auto">
      <div className="flex flex-col items-center text-center">
        {/* Checkmark Circle */}
        <div className="w-[52px] h-[52px] bg-[#E8F0E7] rounded-full flex items-center justify-center mb-5 ring-2 ring-[#7C9E7A]/20">
          <Check className="w-6 h-6 text-[#7C9E7A]" strokeWidth={2} />
        </div>

        {/* Headline */}
        <h1 className="text-[26px] text-[#1C1917] mb-3" style={{ fontWeight: 600 }}>
          You're all set.
        </h1>

        {/* Subtext */}
        <div className="space-y-1 mb-8">
          <p className="text-[16px] text-[#78716C]" style={{ fontWeight: 400, lineHeight: 1.6 }}>
            Your 7 dinners are set.
          </p>
          <p className="text-[16px] text-[#78716C]" style={{ fontWeight: 400, lineHeight: 1.6 }}>
            Nobody has to ask what's for dinner this week.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => navigate("/grocery")}
            className="text-[16px] text-[#7C9E7A]"
            style={{ fontWeight: 400 }}
          >
            See your grocery list
          </button>
          <button
            onClick={() => navigate("/home")}
            className="text-[16px] text-[#78716C]"
            style={{ fontWeight: 400 }}
          >
            Back to this week
          </button>
        </div>
      </div>
    </div>
  );
}