import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { ChefCard, ScreenShell } from "../components/design-system";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { buttonVariants } from "../components/ui/button";
import type { ChefCard as ChefCardType } from "../lib/api";

/** Placeholder chef card until profile fetch API exists. */
const PLACEHOLDER_CHEF_CARD: ChefCardType = {
  buildName: "The Intentional Explorer",
  overallScore: 72,
  tagline: "You balance comfort with discovery",
  cuisineTags: ["American", "Mexican", "Italian", "Asian"],
  comparisons: [
    { name: "The Sunday Slow Roaster", desc: "Comfort-first, low spice", match: 68 },
    { name: "The 20-Minute Closer", desc: "Speed and simplicity", match: 85 },
    { name: "The Flavor Chaser", desc: "Bold, adventurous", match: 42 },
  ],
  dimensionScores: {
    Comfort: 78,
    Speed: 82,
    Boldness: 45,
    Discovery: 65,
    Nourishment: 70,
  },
};

export function ProfilePreferences() {
  const navigate = useNavigate();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <ScreenShell>
      <div className="flex items-center justify-center relative pt-12 pb-6">
        <button
          onClick={() => navigate("/home")}
          className="absolute left-page"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-[17px] text-foreground font-semibold">
          Your Cooking Profile
        </h1>
      </div>

      <div className="mb-4">
        <p className="text-[14px] text-muted-foreground font-normal leading-[1.5]">
          This is your cooking archetype based on your answers. Your plans get
          smarter the more you use{"\u00A0"}Melu.
        </p>
      </div>

      <div className="flex justify-center">
        <ChefCard card={PLACEHOLDER_CHEF_CARD} />
      </div>

      <div className="mb-6 text-center mt-6">
        <p className="text-[13px] text-muted-foreground font-normal leading-[1.5]">
          To update your profile, tap Reset below to retake the questionnaire.
        </p>
      </div>

      <div className="text-center mt-8 pb-8">
        <button
          onClick={() => setShowResetConfirm(true)}
          className="text-[14px] text-muted-foreground font-normal cursor-pointer"
        >
          Reset profile
        </button>
      </div>

      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset profile?</AlertDialogTitle>
            <AlertDialogDescription>
              This will overwrite your current profile and start fresh. You&apos;ll
              retake the questionnaire to get a new cooking archetype.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={() => navigate("/onboarding")}
            >
              Yes, reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ScreenShell>
  );
}