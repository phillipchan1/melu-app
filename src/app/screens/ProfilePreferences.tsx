import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
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
import { fetchChefCard } from "../lib/api";

export function ProfilePreferences() {
  const navigate = useNavigate();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [chefCard, setChefCard] = useState<ChefCardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const card = await fetchChefCard();
        if (!cancelled) setChefCard(card);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

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

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-4 border-border border-t-primary animate-spin" />
        </div>
      )}

      {error && (
        <p className="text-[14px] text-red-500 text-center py-4">{error}</p>
      )}

      {!loading && !error && chefCard && (
        <>
          <div className="flex justify-center">
            <ChefCard card={chefCard} />
          </div>
          <div className="mb-6 text-center mt-6">
            <p className="text-[13px] text-muted-foreground font-normal leading-[1.5]">
              To update your profile, tap Reset below to retake the questionnaire.
            </p>
          </div>
        </>
      )}

      {!loading && !error && !chefCard && (
        <div className="text-center py-8">
          <p className="text-[15px] text-muted-foreground mb-6">
            Complete onboarding to see your Chef Card.
          </p>
          <button
            onClick={() => navigate("/onboarding")}
            className="text-[15px] text-primary font-semibold"
          >
            Get started
          </button>
        </div>
      )}

      {!loading && chefCard && (
        <div className="text-center mt-8 pb-8">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="text-[14px] text-muted-foreground font-normal cursor-pointer"
          >
            Reset profile
          </button>
        </div>
      )}

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