import { useNavigate } from "react-router";

export function GroceryComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-5 max-w-[375px] mx-auto">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-[20px] text-[#1C1917] mb-4" style={{ fontWeight: 600 }}>
          Grocery list
        </h1>
        <p className="text-[15px] text-[#78716C] mb-8 max-w-[280px]" style={{ fontWeight: 400, lineHeight: 1.6 }}>
          This is coming very soon. Your approved plan is saved and ready.
        </p>
        <button
          onClick={() => navigate("/home")}
          className="text-[16px] text-[#7C9E7A] underline underline-offset-2 hover:no-underline"
          style={{ fontWeight: 400 }}
        >
          Back to this week
        </button>
      </div>
    </div>
  );
}