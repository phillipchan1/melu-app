import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";

export function ComingUp() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-[76px] max-w-[375px] mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 pt-12 pb-6">
        <div className="text-[22px] text-[#7C9E7A]" style={{ fontWeight: 600 }}>
          melu
        </div>
        <button onClick={() => navigate("/profile")}>
          <div className="w-8 h-8 bg-[#7C9E7A] rounded-full flex items-center justify-center">
            <span className="text-white text-[14px]" style={{ fontWeight: 600 }}>
              P
            </span>
          </div>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center px-5 text-center" style={{ minHeight: "calc(100vh - 200px)" }}>
        <div className="max-w-[280px]">
          <div className="text-[11px] text-[#78716C] tracking-[0.08em] mb-3" style={{ fontWeight: 600 }}>
            NEXT WEEK
          </div>
          
          <h1 className="text-[20px] text-[#1C1917] mb-3" style={{ fontWeight: 600 }}>
            Your next plan isn't ready yet.
          </h1>
          
          <p className="text-[15px] text-[#78716C] mb-8" style={{ fontWeight: 400, lineHeight: 1.5 }}>
            Melu will build it Sunday morning. Want it now?
          </p>
          
          <button
            onClick={() => navigate("/weekly-checkin")}
            className="w-full h-[52px] bg-[#7C9E7A] rounded-full text-white text-[17px] mb-4"
            style={{ fontWeight: 600 }}
          >
            Generate this week's plan now
          </button>
          
          <p className="text-[13px] text-[#78716C]" style={{ fontWeight: 400 }}>
            Melu will use your profile and this week's approvals.
          </p>
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav activeTab="coming-up" />
    </div>
  );
}