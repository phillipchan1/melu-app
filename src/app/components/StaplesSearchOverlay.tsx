import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Search, X } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";

import type { Staple } from "../lib/api";
import {
  STAPLE_CUISINE_GRID_NODES,
  countEntriesInNode,
  countSelectedInNode,
  filterLibraryByNode,
  partitionTopAndOverflow,
  type CuisineGridNodeId,
} from "../lib/cuisineNodes";
import { sortLibraryEntriesForAspirations } from "../lib/sortMealsByCuisineAdjacency";
import {
  getStapleLibrary,
  libraryEntryToStaple,
  libraryHasExactMatchForQuery,
  searchStapleMeals,
  type StapleLibraryEntry,
} from "../lib/searchStapleMeals";
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

const LIST_CAP = 500;

function StapleChip({
  m,
  onRemove,
  compact,
  panel,
}: Readonly<{
  m: Staple;
  onRemove: () => void;
  compact?: boolean;
  /** Desktop right panel: size to content, wrap in parent; long names cap for truncation. */
  panel?: boolean;
}>) {
  const isCustom = !!m.custom;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 shrink-0 pl-3 pr-1 py-2 rounded-full bg-primary text-primary-foreground text-[13px] min-h-[44px] box-border",
        panel && "w-fit max-w-[min(100%,280px)]",
        !panel && !compact && "max-w-[200px]",
        compact && "max-w-[140px] py-1.5 pl-2 pr-1 min-h-[44px]",
      )}
    >
      <span className="truncate">{m.name}</span>
      {isCustom ? (
        <span className="shrink-0 text-[11px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
          Custom
        </span>
      ) : null}
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center hover:bg-primary-foreground/20"
        aria-label={`Remove ${m.name}`}
      >
        <X className="w-4 h-4" />
      </button>
    </span>
  );
}

function DishPickerChip({
  entry,
  selected,
  onToggle,
}: Readonly<{
  entry: StapleLibraryEntry;
  selected: boolean;
  onToggle: () => void;
}>) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "min-h-[44px] w-full rounded-full px-3 py-2 text-[14px] font-medium leading-snug transition-colors border flex items-center justify-center text-center",
        selected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-foreground border-border hover:bg-secondary/80",
      )}
    >
      <span className="line-clamp-2">{entry.name}</span>
    </button>
  );
}

export function StaplesSearchOverlay({
  open,
  onOpenChange,
  selected,
  onConfirm,
  allowEmptyConfirm = false,
  mode = "staples",
  staplePicks = [],
  /** Full-screen step body (no Dialog) — use on onboarding step 2; modal remains for aspirations / staples management. */
  embedded = false,
  /** When embedded, called after each selection change so parent state stays in sync (Continue uses answers). */
  onSelectionChange,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: Staple[];
  onConfirm: (meals: Staple[]) => void;
  /** When true, Done is enabled with zero items (e.g. staples management screen). */
  allowEmptyConfirm?: boolean;
  mode?: "staples" | "aspirations";
  /** Staple picks from onboarding; used to reorder browse list in aspirations mode */
  staplePicks?: Staple[];
  embedded?: boolean;
  onSelectionChange?: (meals: Staple[]) => void;
}>) {
  const titleId = useId();
  const [searchQuery, setSearchQuery] = useState("");
  const [local, setLocal] = useState<Staple[]>(selected);
  const [activeCuisine, setActiveCuisine] = useState<CuisineGridNodeId | null>(null);
  const [showOverflow, setShowOverflow] = useState(false);

  const library = useMemo(() => getStapleLibrary(), []);

  /** Keep local list in sync when parent `selected` changes (draft, navigation, etc.). */
  useEffect(() => {
    if (embedded || open) {
      setLocal(selected);
    }
  }, [embedded, open, selected]);

  /**
   * Reset browse + search when the overlay opens — not when `selected` changes from a tap.
   * Do not auto-focus search (avoids scroll jump).
   */
  useEffect(() => {
    if (embedded || open) {
      setSearchQuery("");
      setActiveCuisine(null);
      setShowOverflow(false);
    }
  }, [embedded, open]);

  const fuseResults = useMemo(() => searchStapleMeals(searchQuery), [searchQuery]);

  const trimmed = searchQuery.trim();
  const isSearchActive = trimmed.length > 0;

  const searchResults = useMemo(() => {
    if (!isSearchActive) return [];
    let list = fuseResults;
    if (mode === "aspirations") {
      list = sortLibraryEntriesForAspirations(fuseResults, staplePicks);
    }
    return list.slice(0, LIST_CAP);
  }, [fuseResults, isSearchActive, mode, staplePicks]);

  const nodeEntries = useMemo(() => {
    if (!activeCuisine) return [];
    let entries = filterLibraryByNode([...library], activeCuisine);
    if (mode === "aspirations") {
      entries = sortLibraryEntriesForAspirations(entries, staplePicks);
    }
    return entries;
  }, [activeCuisine, library, mode, staplePicks]);

  const { top: topTier, overflow: overflowTier } = useMemo(
    () => partitionTopAndOverflow(nodeEntries),
    [nodeEntries],
  );

  const duplicateName = local.some((m) => normalizeName(m.name) === normalizeName(trimmed));
  const showAddCustom =
    isSearchActive &&
    trimmed.length >= 2 &&
    !duplicateName &&
    !libraryHasExactMatchForQuery(trimmed, library);

  const canConfirmEmpty = allowEmptyConfirm || mode === "aspirations";

  const title =
    mode === "aspirations" ? "What do you want to learn to cook?" : "What are your dinner staples?";
  const subtitle =
    mode === "aspirations"
      ? "These are meals Melu will introduce over time — one new dish at a time, when you're ready."
      : "Meals your family already loves. These anchor every plan.";
  const panelTitle = mode === "aspirations" ? "Your Wishlist" : "Your Staples";
  const doneLabel = mode === "aspirations" ? "Save Wishlist" : "Save Staples";

  const emitEmbeddedIfNeeded = (next: Staple[]) => {
    if (embedded && onSelectionChange) {
      onSelectionChange(next);
    }
  };

  const toggleFromLibrary = (entry: StapleLibraryEntry) => {
    const meal = libraryEntryToStaple(entry);
    setLocal((prev) => {
      const existing = prev.find((p) => libraryCatalogKey(p) === entry.id);
      const next = existing
        ? prev.filter((p) => mealKey(p) !== mealKey(existing))
        : [...prev, meal];
      emitEmbeddedIfNeeded(next);
      return next;
    });
  };

  const addCustom = () => {
    const q = searchQuery.trim();
    if (q.length < 2) return;
    const meal: Staple = {
      id: `custom-${Date.now()}`,
      name: q,
      cuisine: "Custom",
      custom: true,
    };
    setLocal((prev) => {
      if (prev.some((p) => normalizeName(p.name) === normalizeName(q))) return prev;
      const next = [...prev, meal];
      emitEmbeddedIfNeeded(next);
      return next;
    });
    setSearchQuery("");
  };

  const remove = (id: string) => {
    setLocal((prev) => {
      const next = prev.filter((p) => p.id !== id);
      emitEmbeddedIfNeeded(next);
      return next;
    });
  };

  const handleDone = () => {
    onConfirm(local);
    if (!embedded) {
      onOpenChange(false);
    }
  };

  const isSelected = (entry: StapleLibraryEntry) =>
    local.some((p) => libraryCatalogKey(p) === entry.id);

  const activeNodeMeta = activeCuisine
    ? STAPLE_CUISINE_GRID_NODES.find((n) => n.id === activeCuisine)
    : undefined;

  const cuisineGrid = (
    <div className="grid grid-cols-2 gap-3">
      {STAPLE_CUISINE_GRID_NODES.map((node) => {
        const total = countEntriesInNode(node.id);
        const picked = countSelectedInNode(local, node.id, library);
        return (
          <button
            key={node.id}
            type="button"
            onClick={() => {
              setActiveCuisine(node.id);
              setShowOverflow(false);
            }}
            className="rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-secondary/60 flex flex-col gap-1 min-h-[100px]"
          >
            <span className="text-[24px] leading-none" aria-hidden>
              {node.emoji}
            </span>
            <span className="text-[15px] font-medium text-foreground">{node.label}</span>
            <span className="text-[12px] text-muted-foreground">
              {total} {total === 1 ? "dinner" : "dinners"}
            </span>
            {picked > 0 ? (
              <span className="mt-1 inline-flex w-fit rounded-full bg-primary px-2 py-0.5 text-[12px] font-medium text-primary-foreground">
                {picked} picked
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );

  const dishListView =
    activeCuisine && activeNodeMeta ? (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => {
            setActiveCuisine(null);
            setShowOverflow(false);
          }}
          className="text-[15px] font-medium text-primary py-1 -ml-1"
        >
          ← All cuisines
        </button>
        <div>
          <div className="flex items-start gap-2">
            <span className="text-[24px] leading-none shrink-0" aria-hidden>
              {activeNodeMeta.emoji}
            </span>
            <div>
              <h3 className="text-[17px] font-semibold text-foreground">{activeNodeMeta.label}</h3>
              <p className="text-[13px] text-muted-foreground mt-0.5 leading-relaxed">
                {mode === "aspirations"
                  ? `${activeNodeMeta.label} dishes you want to learn — add them to your wishlist.`
                  : `Your go-to ${activeNodeMeta.label} dinners.`}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {topTier.map((entry) => (
            <DishPickerChip
              key={entry.id}
              entry={entry}
              selected={isSelected(entry)}
              onToggle={() => toggleFromLibrary(entry)}
            />
          ))}
        </div>

        {overflowTier.length > 0 ? (
          <>
            <button
              type="button"
              onClick={() => setShowOverflow((o) => !o)}
              className="w-full rounded-2xl border border-dashed border-border py-3 text-[15px] font-medium text-primary bg-card"
            >
              {showOverflow
                ? `Hide extra ${activeNodeMeta.label} dishes`
                : `+ ${overflowTier.length} more ${activeNodeMeta.label} dishes`}
            </button>
            {showOverflow ? (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {overflowTier.map((entry) => (
                  <DishPickerChip
                    key={entry.id}
                    entry={entry}
                    selected={isSelected(entry)}
                    onToggle={() => toggleFromLibrary(entry)}
                  />
                ))}
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    ) : null;

  const searchView = isSearchActive ? (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {searchResults.map((entry) => (
          <DishPickerChip
            key={entry.id}
            entry={entry}
            selected={isSelected(entry)}
            onToggle={() => toggleFromLibrary(entry)}
          />
        ))}
      </div>
      {showAddCustom ? (
        <button
          type="button"
          onClick={addCustom}
          className="mt-2 w-full text-left rounded-2xl px-4 py-3 min-h-[44px] border border-dashed border-border text-[15px] text-primary font-medium bg-card"
        >
          + Add &quot;{trimmed}&quot; as a custom dish
        </button>
      ) : null}
    </div>
  ) : null;

  const browseContent = (() => {
    if (isSearchActive) return searchView;
    if (activeCuisine) return dishListView;
    return cuisineGrid;
  })();

  const desktopYourStaplesPanel = (
    <div
      className={cn(
        "hidden md:flex md:flex-col md:min-h-0 md:max-h-[min(90dvh,900px)] md:sticky md:self-start md:border md:border-border md:rounded-2xl md:p-4 md:bg-card/30",
        "md:w-[320px] md:min-w-[320px] md:max-w-[320px] md:shrink-0",
        embedded ? "md:max-h-[min(70dvh,800px)] md:top-24 md:z-10" : "md:top-0",
      )}
    >
      <h3 className="text-[13px] font-medium text-muted-foreground mb-3 shrink-0">{panelTitle}</h3>
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-wrap content-start items-start gap-2 justify-start">
        {local.length === 0 ? (
          <p className="text-[13px] text-muted-foreground leading-relaxed text-center w-full self-center">
            {mode === "aspirations"
              ? "Nothing yet — add meals you want to learn."
              : "Nothing yet — pick meals your family already loves."}
          </p>
        ) : (
          local.map((m) => (
            <StapleChip key={m.id} m={m} panel onRemove={() => remove(m.id)} />
          ))
        )}
      </div>
      {embedded ? null : (
        <button
          type="button"
          onClick={handleDone}
          disabled={!canConfirmEmpty && local.length === 0}
          className="mt-4 w-full bg-primary text-primary-foreground py-3.5 rounded-2xl text-[16px] font-semibold disabled:opacity-40 shrink-0 min-h-[44px]"
        >
          {doneLabel}
        </button>
      )}
    </div>
  );

  const body = (
    <>
      {embedded ? (
        <span id={titleId} className="sr-only">
          {title}
        </span>
      ) : (
        <div className="px-page pt-10 pb-3 shrink-0 md:pt-6">
          <h2 id={titleId} className="text-[20px] font-semibold text-foreground leading-snug">
            {title}
          </h2>
          <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">{subtitle}</p>
        </div>
      )}

      <div
        className={cn(
          "flex-1 min-h-0 flex flex-col min-w-0 md:grid md:grid-cols-[minmax(0,1fr)_320px] md:gap-8 md:items-start md:min-h-0",
          embedded ? "md:overflow-visible md:px-0" : "md:overflow-hidden md:px-page md:pb-4",
        )}
      >
        <div
          className={cn(
            "flex flex-col min-h-0 flex-1 min-w-0 md:min-h-0",
            embedded ? "md:overflow-visible" : "md:overflow-hidden md:h-full",
          )}
        >
          <div className="px-page md:px-0 pb-3 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search a dinner..."
                className="w-full bg-secondary rounded-2xl pl-10 pr-4 py-3 min-h-[44px] text-[15px] text-foreground placeholder:text-muted-foreground outline-none border border-border"
                autoComplete="off"
              />
            </div>
          </div>

          <div
            className={cn(
              "flex-1 min-h-0 overflow-y-auto px-page md:px-0",
              embedded ? "pb-6 md:overflow-visible md:pb-32" : "pb-[200px] md:pb-0 md:overflow-y-auto",
            )}
          >
            {browseContent}
          </div>
        </div>

        {desktopYourStaplesPanel}
      </div>

      <div
        className={cn(
          "md:hidden shrink-0 bg-background border-t border-border flex flex-col gap-3 px-page pt-3 pb-4",
          !embedded && "fixed bottom-0 left-0 right-0 max-w-[375px] mx-auto z-[60] pb-6",
        )}
      >
        <div className="min-h-[52px] flex flex-col gap-2">
          {local.length === 0 ? (
            <p className="text-[13px] text-muted-foreground text-center py-1">
              {mode === "aspirations"
                ? "Nothing yet — add meals you want to learn."
                : "Your staples will appear here"}
            </p>
          ) : (
            <>
              <p className="text-[12px] text-muted-foreground font-medium">{local.length} selected</p>
              <div className="flex flex-wrap items-center gap-2 max-h-[120px] overflow-y-auto">
                {local.map((m) => (
                  <StapleChip key={m.id} m={m} compact onRemove={() => remove(m.id)} />
                ))}
              </div>
            </>
          )}
        </div>
        {embedded ? null : (
          <button
            type="button"
            onClick={handleDone}
            disabled={!canConfirmEmpty && local.length === 0}
            className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl text-[16px] font-semibold disabled:opacity-40 min-h-[44px]"
          >
            {doneLabel}
          </button>
        )}
      </div>
    </>
  );

  if (embedded) {
    return (
      <section className="flex flex-col flex-1 min-h-0 -mx-page px-page" aria-labelledby={titleId}>
        {body}
      </section>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="z-40 bg-black/50 backdrop-blur-[2px]" />
        <DialogPrimitive.Content
          aria-labelledby={titleId}
          className={cn(
            "fixed inset-0 z-[100] flex flex-col bg-background max-w-[375px] mx-auto w-full h-[100dvh] outline-none",
            "md:max-w-[min(100%,1200px)] md:w-full md:mx-auto",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {body}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

/** Alias for docs/specs — same component as staples + aspirations meal picker. */
export { StaplesSearchOverlay as MealSelector };
