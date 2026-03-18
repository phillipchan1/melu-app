import { useNavigate } from "react-router";

import { ScreenShell } from "../components/design-system";

export function GroceryComingSoon() {
  const navigate = useNavigate();

  return (
    <ScreenShell className="flex items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-[20px] text-foreground mb-4 font-semibold">
          Grocery list
        </h1>
        <p className="text-[15px] text-muted-foreground mb-8 max-w-[280px] font-normal leading-[1.6]">
          This is coming very soon. Your approved plan is saved and ready.
        </p>
        <button
          onClick={() => navigate("/home")}
          className="text-[16px] text-primary underline underline-offset-2 hover:no-underline font-normal"
        >
          Back to this week
        </button>
      </div>
    </ScreenShell>
  );
}