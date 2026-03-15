import { Send } from "lucide-react";
import { useNavigate } from "react-router";

export function ProfileSetup() {
  const navigate = useNavigate();

  const handleChipClick = () => {
    // Navigate to transition screen after completing onboarding
    setTimeout(() => navigate("/onboarding-transition"), 500);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col max-w-[375px] mx-auto relative">
      {/* Header */}
      <div className="pt-12 pb-6 px-5 text-center">
        <div className="text-[22px] text-[#7C9E7A]" style={{ fontWeight: 600 }}>
          melu
        </div>
        <div className="text-[13px] text-[#78716C] mt-1" style={{ fontWeight: 400 }}>
          Step 2 of 4
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-3">
        {/* AI Bubble - Intro */}
        <div className="flex justify-start mb-3">
          <div className="bg-[#F0EFED] rounded-[18px] px-4 py-3.5 max-w-[280px]">
            <p className="text-[15px] text-[#1C1917]" style={{ fontWeight: 400 }}>
              Hey — before I build your first plan, I want to learn your family. Who you're feeding, what's off the table, how much time you actually have. This takes about 2 minutes. You'll never need to do it again.
            </p>
          </div>
        </div>

        {/* AI Bubble 2 */}
        <div className="flex justify-start">
          <div className="bg-[#F0EFED] rounded-[18px] px-4 py-3.5 max-w-[280px]">
            <p className="text-[15px] text-[#1C1917]" style={{ fontWeight: 400 }}>
              How many people are you cooking for, and how old are the kids?
            </p>
          </div>
        </div>

        {/* User Bubble 1 */}
        <div className="flex justify-end">
          <div className="bg-[#7C9E7A] rounded-[18px] px-4 py-3.5 max-w-[280px]">
            <p className="text-[15px] text-white" style={{ fontWeight: 400 }}>
              4 of us — 2 kids, ages 7 and 10.
            </p>
          </div>
        </div>

        {/* AI Bubble 3 */}
        <div className="flex justify-start">
          <div className="bg-[#F0EFED] rounded-[18px] px-4 py-3.5 max-w-[280px]">
            <p className="text-[15px] text-[#1C1917]" style={{ fontWeight: 400 }}>
              Got it. Any foods that are completely off the table? Allergies,
              strong dislikes, anything the kids refuse?
            </p>
          </div>
        </div>

        {/* User Bubble 2 */}
        <div className="flex justify-end">
          <div className="bg-[#7C9E7A] rounded-[18px] px-4 py-3.5 max-w-[280px]">
            <p className="text-[15px] text-white" style={{ fontWeight: 400 }}>
              No shellfish. My 7-year-old won't touch anything spicy.
            </p>
          </div>
        </div>

        {/* AI Bubble 4 */}
        <div className="flex justify-start">
          <div className="bg-[#F0EFED] rounded-[18px] px-4 py-3.5 max-w-[280px]">
            <p className="text-[15px] text-[#1C1917]" style={{ fontWeight: 400 }}>
              Noted — I'll keep everything mild and shellfish-free. On a typical
              weeknight, how much time do you actually have to cook?
            </p>
          </div>
        </div>

        {/* Response Chips */}
        <div className="flex justify-start">
          <div className="flex flex-col gap-2 max-w-[280px]">
            <button
              onClick={handleChipClick}
              className="bg-[#F0EFED] rounded-full px-5 py-3 text-left hover:bg-[#E8E5E0] transition-colors"
            >
              <span className="text-[15px] text-[#1C1917]" style={{ fontWeight: 400 }}>
                Under 30 min — keep it quick
              </span>
            </button>
            <button
              onClick={handleChipClick}
              className="bg-[#F0EFED] rounded-full px-5 py-3 text-left hover:bg-[#E8E5E0] transition-colors"
            >
              <span className="text-[15px] text-[#1C1917]" style={{ fontWeight: 400 }}>
                30–45 min — I can manage
              </span>
            </button>
            <button
              onClick={handleChipClick}
              className="bg-[#F0EFED] rounded-full px-5 py-3 text-left hover:bg-[#E8E5E0] transition-colors"
            >
              <span className="text-[15px] text-[#1C1917]" style={{ fontWeight: 400 }}>
                45 min+ — I like to cook
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