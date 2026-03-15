import { createBrowserRouter } from "react-router";
import { SplashScreen } from "./screens/SplashScreen";
import { ProfileSetup } from "./screens/ProfileSetup";
import { WeeklyCheckIn } from "./screens/WeeklyCheckIn";
import { HomeDashboard } from "./screens/HomeDashboard";
import { ComingUp } from "./screens/ComingUp";
import { WeeklyPlanView } from "./screens/WeeklyPlanView";
import { ApproveConfirmation } from "./screens/ApproveConfirmation";
import { GroceryComingSoon } from "./screens/GroceryComingSoon";
import { ProfilePreferences } from "./screens/ProfilePreferences";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SplashScreen,
  },
  {
    path: "/onboarding",
    Component: ProfileSetup,
  },
  {
    path: "/weekly-checkin",
    Component: WeeklyCheckIn,
  },
  {
    path: "/home",
    Component: HomeDashboard,
  },
  {
    path: "/coming-up",
    Component: ComingUp,
  },
  {
    path: "/plan",
    Component: WeeklyPlanView,
  },
  {
    path: "/confirmation",
    Component: ApproveConfirmation,
  },
  {
    path: "/grocery",
    Component: GroceryComingSoon,
  },
  {
    path: "/profile",
    Component: ProfilePreferences,
  },
]);