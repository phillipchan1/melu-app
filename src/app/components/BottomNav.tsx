import { Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router";

interface BottomNavProps {
  activeTab: "this-week" | "coming-up";
}

export function BottomNav({ activeTab }: BottomNavProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E5E0] h-[60px] flex items-center justify-around max-w-[375px] mx-auto">
      <button
        onClick={() => navigate("/home")}
        className="flex flex-col items-center gap-1 py-2"
      >
        <Calendar
          className="w-6 h-6"
          style={{ color: activeTab === "this-week" ? "#7C9E7A" : "#78716C" }}
        />
        <span
          className="text-[11px]"
          style={{ color: activeTab === "this-week" ? "#7C9E7A" : "#78716C", fontWeight: 400 }}
        >
          This Week
        </span>
      </button>
      <button
        onClick={() => navigate("/coming-up")}
        className="flex flex-col items-center gap-1 py-2"
      >
        <Clock
          className="w-6 h-6"
          style={{ color: activeTab === "coming-up" ? "#7C9E7A" : "#78716C" }}
        />
        <span
          className="text-[11px]"
          style={{ color: activeTab === "coming-up" ? "#7C9E7A" : "#78716C", fontWeight: 400 }}
        >
          Coming Up
        </span>
      </button>
    </div>
  );
}