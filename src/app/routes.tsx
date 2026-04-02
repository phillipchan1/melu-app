import { createBrowserRouter, Outlet } from "react-router";
import { SplashScreen } from "./screens/SplashScreen";
import { ProfileSetup } from "./screens/ProfileSetup";
import { OnboardingTransition } from "./screens/OnboardingTransition";
import { WeeklyCheckIn } from "./screens/WeeklyCheckIn";
import { HomeDashboard } from "./screens/HomeDashboard";
import { ComingUp } from "./screens/ComingUp";
import { WeeklyPlanView } from "./screens/WeeklyPlanView";
import { ApproveConfirmation } from "./screens/ApproveConfirmation";
import { GroceryComingSoon } from "./screens/GroceryComingSoon";
import { ProfilePreferences } from "./screens/ProfilePreferences";
import { StaplesScreen } from "./screens/StaplesScreen";
import { AuthGate } from "./components/AuthGate";

export const router = createBrowserRouter([
  {
    element: (
      <AuthGate>
        <Outlet />
      </AuthGate>
    ),
    children: [
      { index: true, Component: SplashScreen },
      {
        path: "onboarding/staples",
        Component: ProfileSetup,
      },
      {
        path: "onboarding",
        Component: ProfileSetup,
      },
      {
        path: "onboarding-transition",
        Component: OnboardingTransition,
      },
      {
        path: "weekly-checkin",
        Component: WeeklyCheckIn,
      },
      {
        path: "home",
        Component: HomeDashboard,
      },
      {
        path: "coming-up",
        Component: ComingUp,
      },
      {
        path: "plan",
        Component: WeeklyPlanView,
      },
      {
        path: "confirmation",
        Component: ApproveConfirmation,
      },
      {
        path: "grocery",
        Component: GroceryComingSoon,
      },
      {
        path: "profile",
        Component: ProfilePreferences,
      },
      {
        path: "staples",
        Component: StaplesScreen,
      },
    ],
  },
]);