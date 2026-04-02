import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { SplashScreen } from "./screens/SplashScreen";
import { ProfileSetup } from "./screens/ProfileSetup";
import { OnboardingComplete } from "./screens/OnboardingComplete";
import { ChefCardLoading } from "./screens/ChefCardLoading";
import { OnboardingChefCard } from "./screens/OnboardingChefCard";
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
        path: "onboarding/complete",
        Component: OnboardingComplete,
      },
      {
        path: "onboarding/loading",
        Component: ChefCardLoading,
      },
      {
        path: "onboarding/chef-card",
        Component: OnboardingChefCard,
      },
      {
        path: "onboarding/goals",
        element: <Navigate to="/onboarding/aspirations" replace />,
      },
      {
        path: "onboarding-transition",
        element: <Navigate to="/onboarding/complete" replace />,
      },
      {
        path: "onboarding/*",
        Component: ProfileSetup,
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
