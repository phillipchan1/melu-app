import { useEffect } from "react";
import { useNavigate } from "react-router";

export function OnboardingTransition() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/weekly-checkin");
    }, 3000); // Auto-advance after 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-5 text-center">
      {/* Animated checkmark */}
      <div className="mb-8">
        <div className="w-16 h-16 rounded-full bg-[#E8F0E7] flex items-center justify-center animate-pulse">
          <svg
            className="w-8 h-8 text-[#7C9E7A]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-semibold text-[#1C1917] mb-4">
        We're learning about you.
      </h1>

      {/* Subtext */}
      <p className="text-base text-[#78716C] leading-relaxed max-w-xs mb-8">
        Every meal we suggest will be tailored to your family — exactly what you love, nothing you don't.
      </p>

      {/* Progress indicator */}
      <div className="mt-12">
        <div className="flex gap-2 items-center">
          <div className="w-2 h-2 rounded-full bg-[#7C9E7A] animate-bounce" style={{ animationDelay: "0s" }} />
          <div className="w-2 h-2 rounded-full bg-[#7C9E7A] animate-bounce" style={{ animationDelay: "0.2s" }} />
          <div className="w-2 h-2 rounded-full bg-[#7C9E7A] animate-bounce" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>

      {/* Skip text */}
      <button
        onClick={() => navigate("/weekly-checkin")}
        className="mt-16 text-sm text-[#78716C] underline"
      >
        Skip
      </button>
    </div>
  );
}
