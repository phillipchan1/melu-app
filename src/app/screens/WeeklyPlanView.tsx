import { useNavigate } from "react-router";

import { BottomNav } from "../components/BottomNav";
import { Button } from "../components/ui/button";
import { MealCard, ScreenShell } from "../components/design-system";

const MEALS = [
  {
    day: "MONDAY",
    name: "Sheet Pan Lemon Chicken",
    time: "30 min",
    cuisine: "American",
    ingredients: "Chicken, lemon, potatoes, green beans, garlic",
    reason: "Under 30 min — fits your weeknights.",
  },
  {
    day: "TUESDAY",
    name: "Beef Tacos",
    time: "20 min",
    cuisine: "Mexican",
    ingredients: "Ground beef, tortillas, cheddar, lettuce, tomato",
    reason: "Your kids approved this twice.",
  },
  {
    day: "WEDNESDAY",
    name: "Pasta Primavera",
    time: "25 min",
    cuisine: "Italian",
    ingredients: "Pasta, bell peppers, broccoli, parmesan, olive oil",
    reason: "Mild and family-friendly.",
  },
  {
    day: "THURSDAY",
    name: "Teriyaki Salmon",
    time: "25 min",
    cuisine: "Asian",
    ingredients: "Salmon, teriyaki sauce, rice, broccoli, sesame",
    reason: "Phil, you gave this a thumbs up.",
  },
  {
    day: "FRIDAY",
    name: "BBQ Chicken Quesadillas",
    time: "20 min",
    cuisine: "American",
    ingredients: "Chicken, tortillas, cheddar, BBQ sauce, green onion",
    reason: "Fast — under 20 min.",
  },
  {
    day: "SATURDAY",
    name: "Slow Cooker Pulled Pork",
    time: "15 min active",
    cuisine: "American",
    ingredients: "Pork shoulder, BBQ sauce, slider buns, coleslaw",
    reason: "Weekend — more time, crowd-pleaser.",
  },
  {
    day: "SUNDAY",
    name: "One-Pan Roast Chicken",
    time: "20 min active",
    cuisine: "American",
    ingredients: "Whole chicken, potatoes, rosemary, garlic, lemon",
    reason: "Sunday dinner — simple, satisfying.",
  },
];

export function WeeklyPlanView() {
  const navigate = useNavigate();

  return (
    <ScreenShell className="pb-[136px]">
      <div className="pt-12 pb-6">
        <h1 className="text-[24px] text-foreground mb-2 font-semibold">
          Your week, sorted.
        </h1>
        <p className="text-[15px] text-muted-foreground font-normal">
          7 dinners, ready to go.
        </p>
      </div>

      <div className="space-y-3">
        {MEALS.map((meal) => (
          <MealCard
            key={meal.day}
            day={meal.day}
            name={meal.name}
            time={meal.time}
            cuisine={meal.cuisine}
            ingredients={meal.ingredients}
            reason={meal.reason}
          />
        ))}
      </div>

      <div className="fixed bottom-[76px] left-0 right-0 px-page max-w-[375px] mx-auto">
        <Button
          variant="melu"
          onClick={() => navigate("/confirmation")}
          className="text-[17px] font-semibold"
        >
          Looks good – approve this week
        </Button>
      </div>

      <BottomNav activeTab="this-week" />
    </ScreenShell>
  );
}