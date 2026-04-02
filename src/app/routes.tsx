import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { SplashScreen } from "./screens/SplashScreen";
import { ProfileSetup } from "./screens/ProfileSetup";
import { ChefCardLoading } from "./screens/ChefCardLoading";
import { OnboardingChefCard } from "./screens/OnboardingChefCard";
import { WeeklyCheckIn } from "./screens/WeeklyCheckIn";
import { WeeklyCheckInContext } from "./screens/WeeklyCheckInContext";
import { HomeDashboard } from "./screens/HomeDashboard";
import { ComingUp } from "./screens/ComingUp";
import { WeeklyPlanView } from "./screens/WeeklyPlanView";
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
        element: <Navigate to="/onboarding" replace />,
      },
      {
        path: "onboarding/*",
        Component: ProfileSetup,
      },
      {
        path: "weekly-checkin/context",
        Component: WeeklyCheckInContext,
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
      // /confirmation (ApproveConfirmation) removed — approve navigates to /home?approved=true
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
