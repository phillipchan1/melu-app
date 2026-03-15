import { Send } from "lucide-react";
import { useNavigate } from "react-router";

export function WeeklyCheckIn() {
  const navigate = useNavigate();

  const handleGeneratePlan = () => {
    // Navigate to plan view after generating
    setTimeout(() => navigate("/plan"), 500);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col max-w-[375px] mx-auto relative">
      {/* Header */}
      <div className="pt-12 pb-6 px-5 text-center">
        <div className="text-[22px] text-[#7C9E7A]" style={{ fontWeight: 600 }}>
          melu
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-3">
        {/* AI Bubble - Opening */}
        <div className="flex justify-start">
          <div className="bg-[#F0EFED] rounded-[18px] px-4 py-3.5 max-w-[280px]">
            <p className="text-[15px] text-[#1C1917]" style={{ fontWeight: 400 }}>
              Hey Phil — ready to plan this week. Anything I should know before I build your dinners?
            </p>
          </div>
        </div>

        {/* User Bubble */}
        <div className="flex justify-end">
          <div className="bg-[#7C9E7A] rounded-[18px] px-4 py-3.5 max-w-[280px]">
            <p className="text-[15px] text-white" style={{ fontWeight: 400 }}>
              We have soccer Thursday so something really fast that night.
            </p>
          </div>
        </div>

        {/* AI Bubble - Response */}
        <div className="flex justify-start">
          <div className="bg-[#F0EFED] rounded-[18px] px-4 py-3.5 max-w-[280px]">
            <p className="text-[15px] text-[#1C1917]" style={{ fontWeight: 400 }}>
              Got it — I'll put a 20-minute meal on Thursday. Anything else, or should I start building?
            </p>
          </div>
        </div>

        {/* Response Chips */}
        <div className="flex justify-start">
          <div className="flex gap-2 max-w-[280px]">
            <button
              onClick={handleGeneratePlan}
              className="bg-[#F0EFED] rounded-full px-5 py-3 hover:bg-[#E8E5E0] transition-colors"
            >
              <span className="text-[15px] text-[#1C1917]" style={{ fontWeight: 400 }}>
                Build my plan
              </span>
            </button>
            <button
              className="bg-[#F0EFED] rounded-full px-5 py-3 hover:bg-[#E8E5E0] transition-colors"
            >
              <span className="text-[15px] text-[#1C1917]" style={{ fontWeight: 400 }}>
                One more thing...
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FAF8F5] border-t border-[#E8E5E0] px-5 py-3 max-w-[375px] mx-auto">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-white rounded-full px-4 py-3 text-[15px] text-[#1C1917] outline-none border border-[#E8E5E0]"
            style={{ fontWeight: 400 }}
          />
          <button className="w-12 h-12 bg-[#7C9E7A] rounded-full flex items-center justify-center">
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}