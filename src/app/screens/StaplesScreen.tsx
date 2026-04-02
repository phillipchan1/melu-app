import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { BottomNav } from "../components/BottomNav";
import { StaplesSearchOverlay } from "../components/StaplesSearchOverlay";
import { ScreenShell } from "../components/design-system";
import { type Staple, fetchStaples, replaceStaples } from "../lib/api";

export function StaplesScreen() {
  const navigate = useNavigate();
  const [staples, setStaples] = useState<Staple[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const list = await fetchStaples();
        if (!cancelled) setStaples(list);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load staples");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleConfirm = async (next: Staple[]) => {
    setError(null);
    try {
      const saved = await replaceStaples(next);
      setStaples(saved);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save staples");
    }
  };

  return (
    <ScreenShell className="pb-[76px]">
      <div className="flex items-center justify-between pt-12 pb-6">
        <button type="button" onClick={() => navigate("/home")} aria-label="Back to home">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <span className="text-[22px] text-primary font-semibold">melu</span>
        <button type="button" onClick={() => navigate("/profile")} aria-label="Profile">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-[14px] font-semibold">P</span>
          </div>
        </button>
      </div>

      <div className="mb-6">
        <h1 className="text-[18px] text-foreground font-semibold mb-1">Your staples</h1>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Dinners you cook often. We use these to personalize your plans.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-4 border-border border-t-primary animate-spin" />
        </div>
      )}

      {error && <p className="text-[14px] text-red-500 text-center py-4">{error}</p>}

      {!loading && (
        <>
          {staples.length === 0 ? (
            <p className="text-[15px] text-muted-foreground mb-6">
              No staples yet. Add your go-to dinners.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 mb-6">
              {staples.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center rounded-full bg-secondary px-4 py-2 text-[14px] text-foreground"
                >
                  {s.name}
                </span>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setOverlayOpen(true)}
            className="w-full rounded-2xl bg-primary text-primary-foreground py-3.5 text-[16px] font-semibold"
          >
            {staples.length === 0 ? "Add staples" : "Edit staples"}
          </button>
        </>
      )}

      <StaplesSearchOverlay
        open={overlayOpen}
        onOpenChange={setOverlayOpen}
        selected={staples}
        onConfirm={handleConfirm}
        allowEmptyConfirm
      />

      <BottomNav activeTab="staples" />
    </ScreenShell>
  );
}
