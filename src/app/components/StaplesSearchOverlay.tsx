import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Search, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import type { Staple } from "../lib/api";
import {
  getRotationLibrary,
  libraryEntryToStaple,
  searchRotationMeals,
  type RotationLibraryEntry,
} from "../lib/searchRotationMeals";
import { Dialog, DialogOverlay, DialogPortal } from "./ui/dialog";
import { cn } from "./ui/utils";

function isUuidLike(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function mealKey(m: Staple): string {
  return m.id;
}

/** Stable key for matching catalog rows (library id), including DB rows with UUID `id`. */
function libraryCatalogKey(m: Staple): string | undefined {
  if (m.custom) return undefined;
  if (m.libraryMealId) return m.libraryMealId;
  if (!isUuidLike(m.id)) return m.id;
  return undefined;
}

function normalizeName(s: string): string {
  return s.trim().toLowerCase();
}

export function StaplesSearchOverlay({
  open,
  onOpenChange,
  selected,
  onConfirm,
  allowEmptyConfirm = false,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: Staple[];
  onConfirm: (meals: Staple[]) => void;
  /** When true, Done is enabled with zero items (e.g. staples management screen). */
  allowEmptyConfirm?: boolean;
}>) {
  const titleId = useId();
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [local, setLocal] = useState<Staple[]>(selected);

  useEffect(() => {
    if (open) {
      setLocal(selected);
      setQuery("");
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open, selected]);

  const results: RotationLibraryEntry[] = searchRotationMeals(query).slice(0, 50);
  const library = getRotationLibrary();
  const browseList = query.trim() ? results : [...library];

  const trimmed = query.trim();
  const showAddCustom =
    trimmed.length >= 2 &&
    !local.some((m) => normalizeName(m.name) === normalizeName(trimmed));

  const toggleFromLibrary = (entry: RotationLibraryEntry) => {
    const meal = libraryEntryToStaple(entry);
    setLocal((prev) => {
      const existing = prev.find((p) => libraryCatalogKey(p) === entry.id);
      if (existing) {
        return prev.filter((p) => mealKey(p) !== mealKey(existing));
      }
      return [...prev, meal];
    });
  };

  const addCustom = () => {
    if (!trimmed) return;
    const meal: Staple = {
      id: `custom-${crypto.randomUUID()}`,
      name: trimmed,
      cuisine: "Other",
      custom: true,
    };
    setLocal((prev) => {
      if (prev.some((p) => normalizeName(p.name) === normalizeName(trimmed))) return prev;
      return [...prev, meal];
    });
    setQuery("");
  };

  const remove = (id: string) => {
    setLocal((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDone = () => {
    onConfirm(local);
    onOpenChange(false);
  };

  const isSelected = (entry: RotationLibraryEntry) =>
    local.some((p) => libraryCatalogKey(p) === entry.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-background/95 backdrop-blur-[2px]" />
        <DialogPrimitive.Content
          aria-labelledby={titleId}
          className={cn(
            "fixed inset-0 z-50 flex flex-col bg-background max-w-[375px] mx-auto w-full h-[100dvh] outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="px-page pt-10 pb-3 shrink-0">
            <h2 id={titleId} className="text-[20px] font-semibold text-foreground leading-snug">
              What are your dinner staples?
            </h2>
            <p className="text-[13px] text-muted-foreground mt-1">Add as many as you want</p>
          </div>

          <div className="px-page pb-3 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground pointer-events-none" />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a dinner..."
                className="w-full bg-secondary rounded-2xl pl-10 pr-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground outline-none border border-border"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-page pb-[200px]">
            <ul className="flex flex-col gap-1">
              {browseList.map((entry) => {
                const selectedRow = isSelected(entry);
                return (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => toggleFromLibrary(entry)}
                      className={cn(
                        "w-full flex items-center justify-between gap-3 text-left rounded-2xl px-4 py-3 min-h-[52px] transition-colors",
                        selectedRow
                          ? "bg-primary/15 border border-primary/40"
                          : "bg-card border border-border hover:bg-secondary/80",
                      )}
                    >
                      <span className="text-[15px] text-foreground font-normal">{entry.name}</span>
                      <span
                        className={cn(
                          "shrink-0 text-[12px] px-2.5 py-1 rounded-full",
                          selectedRow ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
                        )}
                      >
                        {entry.cuisine}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {showAddCustom && (
              <button
                type="button"
                onClick={addCustom}
                className="mt-3 w-full text-left rounded-2xl px-4 py-3 border border-dashed border-border text-[15px] text-primary font-medium bg-card"
              >
                Add &quot;{trimmed}&quot;
              </button>
            )}
          </div>

          <div className="fixed bottom-0 left-0 right-0 max-w-[375px] mx-auto bg-background border-t border-border z-[60] flex flex-col gap-3 px-page pt-3 pb-6">
            <button
              type="button"
              onClick={handleDone}
              disabled={!allowEmptyConfirm && local.length === 0}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl text-[16px] font-semibold disabled:opacity-40"
            >
              Done
            </button>

            <div className="min-h-[72px]">
              {local.length === 0 ? (
                <p className="text-[13px] text-muted-foreground text-center py-2">Your staples will appear here</p>
              ) : (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {local.map((m) => (
                    <span
                      key={m.id}
                      className="inline-flex items-center gap-1.5 shrink-0 max-w-[200px] pl-3 pr-1 py-2 rounded-full bg-primary text-primary-foreground text-[13px]"
                    >
                      <span className="truncate">{m.name}</span>
                      <button
                        type="button"
                        onClick={() => remove(m.id)}
                        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center hover:bg-primary-foreground/20"
                        aria-label={`Remove ${m.name}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
