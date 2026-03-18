import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { type ChatMessage, type ExtractedProfile, sendPersonalizationMessage } from "../lib/api";

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ProfileSetup() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedProfile, setExtractedProfile] = useState<ExtractedProfile>({
    dietaryPreferences: [],
    allergies: [],
    dislikedIngredients: [],
    preferredCuisines: [],
    householdNotes: [],
    goals: [],
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  };

  const callApi = async (conversationMessages: DisplayMessage[]) => {
    setIsLoading(true);
    setError(null);

    const apiMessages: ChatMessage[] = conversationMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const data = await sendPersonalizationMessage(apiMessages, extractedProfile);

      const assistantMessage: DisplayMessage = { id: crypto.randomUUID(), role: "assistant", content: data.message };
      setMessages((prev) => [...prev, assistantMessage]);

      if (data.extractedProfile) {
        setExtractedProfile((prev) => mergeProfile(prev, data.extractedProfile));
      }

      if (data.done) {
        setTimeout(() => navigate("/onboarding-transition"), 1000);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    callApi([]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: DisplayMessage = { id: crypto.randomUUID(), role: "user", content: trimmed };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput("");
    inputRef.current?.focus();

    await callApi(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-24 space-y-3">
        {messages.map((msg) =>
          msg.role === "assistant" ? (
            <div key={msg.id} className="flex justify-start">
              <div className="bg-[#F0EFED] rounded-[18px] px-4 py-3.5 max-w-[280px]">
                <p className="text-[15px] text-[#1C1917]" style={{ fontWeight: 400 }}>
                  {msg.content}
                </p>
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex justify-end">
              <div className="bg-[#7C9E7A] rounded-[18px] px-4 py-3.5 max-w-[280px]">
                <p className="text-[15px] text-white" style={{ fontWeight: 400 }}>
                  {msg.content}
                </p>
              </div>
            </div>
          )
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#F0EFED] rounded-[18px] px-4 py-3.5">
              <div className="flex gap-1 items-center h-5">
                <span className="w-2 h-2 bg-[#78716C] rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-[#78716C] rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-[#78716C] rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <p className="text-[13px] text-red-500 text-center">{error}</p>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FAF8F5] border-t border-[#E8E5E0] px-5 py-3 max-w-[375px] mx-auto">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1 bg-[#F0EFED] rounded-full px-4 py-3 text-[15px] text-[#1C1917] placeholder:text-[#78716C] outline-none border border-[#E8E5E0] disabled:opacity-50"
            style={{ fontWeight: 400 }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 bg-[#7C9E7A] rounded-full flex items-center justify-center disabled:opacity-40 transition-opacity"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function mergeProfile(
  prev: ExtractedProfile,
  next: Partial<ExtractedProfile>,
): ExtractedProfile {
  return {
    dietaryPreferences: dedupe([...prev.dietaryPreferences, ...(next.dietaryPreferences ?? [])]),
    allergies: dedupe([...prev.allergies, ...(next.allergies ?? [])]),
    dislikedIngredients: dedupe([...prev.dislikedIngredients, ...(next.dislikedIngredients ?? [])]),
    preferredCuisines: dedupe([...prev.preferredCuisines, ...(next.preferredCuisines ?? [])]),
    householdNotes: dedupe([...prev.householdNotes, ...(next.householdNotes ?? [])]),
    goals: dedupe([...prev.goals, ...(next.goals ?? [])]),
  };
}

function dedupe(arr: string[]): string[] {
  return [...new Set(arr)];
}
