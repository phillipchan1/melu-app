import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";

export function HomeDashboard() {
  const navigate = useNavigate();

  const meals = [
    { day: "MON", name: "Sheet Pan Lemon Chicken" },
    { day: "TUE", name: "Beef Tacos" },
    { day: "WED", name: "Pasta Primavera" },
    { day: "THU", name: "Teriyaki Salmon" },
    { day: "FRI", name: "BBQ Chicken Quesadillas" },
  ];

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

      {/* Greeting Block */}
      <div className="px-5 mb-6">
        <h1 className="text-[18px] text-[#1C1917] mb-1" style={{ fontWeight: 600 }}>
          Good morning, Phil.
        </h1>
        <p className="text-[15px] text-[#78716C]" style={{ fontWeight: 400 }}>
          This week's plan is set.
        </p>
      </div>

      {/* This Week Card */}
      <div className="px-5 mb-6">
        <div className="text-[11px] text-[#78716C] tracking-[0.08em] mb-2" style={{ fontWeight: 600 }}>
          THIS WEEK
        </div>
        <div className="bg-white rounded-2xl p-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          {[
            { day: "MON", meal: "Sheet Pan Lemon Chicken" },
            { day: "TUE", meal: "Beef Tacos" },
            { day: "WED", meal: "Pasta Primavera" },
            { day: "THU", meal: "Teriyaki Salmon" },
            { day: "FRI", meal: "BBQ Chicken Quesadillas" },
            { day: "SAT", meal: "Slow Cooker Pulled Pork" },
            { day: "SUN", meal: "One-Pan Roast Chicken" },
          ].map((item, index) => (
            <div key={item.day}>
              <div className="flex items-center justify-between py-2">
                <span className="text-[12px] text-[#78716C]" style={{ fontWeight: 400 }}>
                  {item.day}
                </span>
                <span className="text-[15px] text-[#1C1917] flex-1 text-right" style={{ fontWeight: 400 }}>
                  {item.meal}
                </span>
              </div>
              {index < 6 && <div className="border-t border-[#F5F3F0]" />}
            </div>
          ))}
          <div className="mt-3 text-right">
            <button
              onClick={() => navigate("/plan")}
              className="text-[14px] text-[#7C9E7A]"
              style={{ fontWeight: 400 }}
            >
              View full plan →
            </button>
          </div>
        </div>
      </div>

      {/* Next Sunday Nudge */}
      <div className="px-5 mb-4 text-center">
        <p className="text-[13px] text-[#78716C]" style={{ fontWeight: 400 }}>
          Next plan generates Sunday.
        </p>
      </div>

      {/* Grocery Button */}
      <div className="px-5">
        <button
          onClick={() => navigate("/grocery")}
          className="w-full h-[52px] rounded-full border-[1.5px] border-[#7C9E7A] text-[#7C9E7A] text-[16px] bg-transparent"
          style={{ fontWeight: 400 }}
        >
          See this week's groceries
        </button>
      </div>

      {/* Bottom Nav */}
      <BottomNav activeTab="this-week" />
    </div>
  );
}