import { useNavigate } from "react-router";

export function SplashScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-5 max-w-[375px] mx-auto">
      <div className="flex flex-col items-center text-center" style={{ marginTop: "-60px" }}>
        {/* Wordmark */}
        <div className="text-[26px] text-[#7C9E7A] mb-8" style={{ fontWeight: 600 }}>
          melu
        </div>

        {/* Headline */}
        <h1 
          className="text-[24px] text-[#1C1917] mb-5 max-w-[280px]" 
          style={{ fontWeight: 600, lineHeight: 1.3 }}
        >
          Dinner, planned.
          <br />
          Every week. In 60 seconds.
        </h1>

        {/* Body text */}
        <p 
          className="text-[16px] text-[#78716C] mb-10 max-w-[300px]" 
          style={{ fontWeight: 400, lineHeight: 1.6 }}
        >
          To plan for you, Melu needs to know your family — who you're feeding, what you love, and what's off the table. It takes about 2 minutes. You'll never need to do it again.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/onboarding")}
          className="w-full h-[52px] bg-[#7C9E7A] rounded-full text-white text-[17px] mb-4"
          style={{ fontWeight: 600 }}
        >
          Let's get started
        </button>

        {/* Subtext */}
        <p className="text-[13px] text-[#78716C]" style={{ fontWeight: 400 }}>
          No account needed to try it.
        </p>
      </div>
    </div>
  );
}
