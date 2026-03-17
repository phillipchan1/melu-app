import { Clock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";

export function WeeklyPlanView() {
  const navigate = useNavigate();

  const meals = [
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

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-[136px] max-w-[375px] mx-auto">
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <h1 className="text-[24px] text-[#1C1917] mb-2" style={{ fontWeight: 600 }}>
          Your week, sorted.
        </h1>
        <p className="text-[15px] text-[#78716C]" style={{ fontWeight: 400 }}>
          7 dinners, ready to go.
        </p>
      </div>

      {/* Meal Cards */}
      <div className="px-5 space-y-3">
        {meals.map((meal) => (
          <div
            key={meal.day}
            className="bg-white rounded-2xl p-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
          >
            <div className="text-[11px] text-[#78716C] tracking-[0.08em] mb-2" style={{ fontWeight: 400 }}>
              {meal.day}
            </div>
            <h2 className="text-[20px] text-[#1C1917] mb-3" style={{ fontWeight: 600 }}>
              {meal.name}
            </h2>
            <div className="flex gap-2 mb-3">
              <div className="flex items-center gap-1 bg-[#F0EFED] rounded-full px-2.5 py-1">
                <Clock className="w-3 h-3 text-[#78716C]" />
                <span className="text-[13px] text-[#78716C]" style={{ fontWeight: 400 }}>
                  {meal.time}
                </span>
              </div>
              <div className="bg-[#F0EFED] rounded-full px-2.5 py-1">
                <span className="text-[13px] text-[#78716C]" style={{ fontWeight: 400 }}>
                  {meal.cuisine}
                </span>
              </div>
            </div>
            <p className="text-[14px] text-[#78716C] italic mb-2" style={{ fontWeight: 400 }}>
              {meal.ingredients}
            </p>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#7C9E7A]" />
              <p className="text-[12px] text-[#7C9E7A]" style={{ fontWeight: 400 }}>
                {meal.reason}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-[76px] left-0 right-0 px-5 max-w-[375px] mx-auto">
        <button
          onClick={() => navigate("/confirmation")}
          className="w-full h-[52px] bg-[#7C9E7A] rounded-full text-white text-[17px]"
          style={{ fontWeight: 600 }}
        >
          Looks good – approve this week
        </button>
      </div>

      {/* Bottom Nav */}
      <BottomNav activeTab="this-week" />
    </div>
  );
}