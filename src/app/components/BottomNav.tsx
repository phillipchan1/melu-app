import { Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router";

interface BottomNavProps {
  activeTab: "this-week" | "coming-up";
}

export function BottomNav({ activeTab }: BottomNavProps) {
  const navigate = useNavigate();

  const activeClass = "text-primary";
  const inactiveClass = "text-muted-foreground";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-[0_-1px_4px_rgba(0,0,0,0.04)] h-[60px] flex items-center justify-around max-w-[375px] mx-auto">
      <button
        type="button"
        onClick={() => navigate("/home")}
        className="flex flex-col items-center gap-1 py-2 min-w-[72px]"
      >
        <Calendar
          className={`w-6 h-6 ${activeTab === "this-week" ? activeClass : inactiveClass}`}
        />
        <span
          className={`text-[11px] font-normal ${activeTab === "this-week" ? activeClass : inactiveClass}`}
        >
          This week
        </span>
      </button>
      <button
        type="button"
        onClick={() => navigate("/coming-up")}
        className="flex flex-col items-center gap-1 py-2 min-w-[72px]"
      >
        <Clock
          className={`w-6 h-6 ${activeTab === "coming-up" ? activeClass : inactiveClass}`}
        />
        <span
          className={`text-[11px] font-normal ${activeTab === "coming-up" ? activeClass : inactiveClass}`}
        >
          Coming up
        </span>
      </button>
    </div>
  );
}
