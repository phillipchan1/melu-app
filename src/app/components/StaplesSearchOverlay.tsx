import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Search, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import type { Staple } from "../lib/api";
import {
  STAPLE_CUISINE_TAB_ALL,
  STAPLE_CUISINE_TABS_EXTRA,
  STAPLE_CUISINE_TABS_PRIMARY,
  type StapleCuisineTabId,
  filterEntriesByCuisineTab,
} from "../lib/stapleLibraryFilters";
import { sortLibraryEntriesForAspirations } from "../lib/sortMealsByCuisineAdjacency";
import { libraryEntryToStaple, searchStapleMeals, type StapleLibraryEntry } from "../lib/searchStapleMeals";
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
        "inline-flex items-center gap-1.5 shrink-0 pl-3 pr-1 py-2 rounded-full bg-primary text-primary-foreground text-[13px]",
        panel && "w-fit max-w-[min(100%,280px)]",
        !panel && !compact && "max-w-[200px]",
        compact && "max-w-[120px] py-1.5 pl-2 pr-1",
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
  const tablistPrimaryId = useId();
  const tablistExtraId = useId();
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [local, setLocal] = useState<Staple[]>(selected);
  const [activeCuisineTab, setActiveCuisineTab] = useState<StapleCuisineTabId>(STAPLE_CUISINE_TAB_ALL);
  const [extraTabsOpen, setExtraTabsOpen] = useState(false);

  /** Keep local list in sync when parent `selected` changes (draft, navigation, etc.). */
  useEffect(() => {
    if (embedded || open) {
      setLocal(selected);
    }
  }, [embedded, open, selected]);

  /**
   * Reset filters and focus search only when the overlay opens — not when `selected` changes
   * from a tap (refocusing the input scrolls the page to the search field).
   */
  useEffect(() => {
    if (embedded || open) {
      setQuery("");
      setActiveCuisineTab(STAPLE_CUISINE_TAB_ALL);
      setExtraTabsOpen(false);
      requestAnimationFrame(() => searchRef.current?.focus({ preventScroll: true }));
    }
  }, [embedded, open]);

  const fuseResults = useMemo(() => searchStapleMeals(query), [query]);

  const browseList = useMemo(() => {
    const q = query.trim();
    let ordered = fuseResults;
    if (mode === "aspirations" && q === "") {
      ordered = sortLibraryEntriesForAspirations(fuseResults, staplePicks);
    }
    const afterTab = filterEntriesByCuisineTab(ordered, activeCuisineTab);
    return afterTab.slice(0, LIST_CAP);
  }, [fuseResults, activeCuisineTab, mode, staplePicks, query]);

  const trimmed = query.trim();
  const duplicateName = local.some((m) => normalizeName(m.name) === normalizeName(trimmed));
  const showAddCustom =
    browseList.length === 0 && trimmed.length >= 2 && !duplicateName;

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
    if (!trimmed) return;
    const meal: Staple = {
      id: `custom-${crypto.randomUUID()}`,
      name: trimmed,
      cuisine: "Other",
      custom: true,
    };
    setLocal((prev) => {
      if (prev.some((p) => normalizeName(p.name) === normalizeName(trimmed))) return prev;
      const next = [...prev, meal];
      emitEmbeddedIfNeeded(next);
      return next;
    });
    setQuery("");
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

  const mobilePreview = local.slice(0, 3);
  const mobileMore = Math.max(0, local.length - 3);

  const renderTabButton = (id: StapleCuisineTabId, label: string) => {
    const isActive = activeCuisineTab === id;
    return (
      <button
        key={id}
        type="button"
        role="tab"
        aria-selected={isActive}
        id={`staple-tab-${id}`}
        onClick={() => setActiveCuisineTab(id)}
        className={cn(
          "shrink-0 rounded-full px-4 py-2 text-[14px] transition-colors whitespace-nowrap",
          isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-border",
        )}
      >
        {label}
      </button>
    );
  };

  const cuisineTabRows = (
    <div className="flex flex-col gap-2 shrink-0 min-w-0">
      <div
        className="flex flex-nowrap gap-2 overflow-x-auto pb-1 scrollbar-thin -mx-page px-page md:mx-0 md:px-0 min-w-0"
        role="tablist"
        aria-label="Cuisine filter"
        id={tablistPrimaryId}
      >
        {STAPLE_CUISINE_TABS_PRIMARY.map(({ id, label }) => renderTabButton(id, label))}
      </div>
      <button
        type="button"
        className="md:hidden text-left text-[13px] font-medium text-primary py-1 -mx-page px-page"
        onClick={() => setExtraTabsOpen((o) => !o)}
        aria-expanded={extraTabsOpen}
      >
        {extraTabsOpen ? "Hide more cuisines" : "More cuisines"}
      </button>
      <div
        className={cn(
          "flex flex-nowrap gap-2 overflow-x-auto pb-1 scrollbar-thin -mx-page px-page md:mx-0 md:px-0 min-w-0",
          !extraTabsOpen && "hidden md:flex",
        )}
        role="tablist"
        aria-label="Additional cuisine filters"
        id={tablistExtraId}
      >
        {STAPLE_CUISINE_TABS_EXTRA.map(({ id, label }) => renderTabButton(id, label))}
      </div>
    </div>
  );

  const mealList = (
    <ul className="flex flex-col gap-1">
      {browseList.map((entry) => {
        const selectedRow = isSelected(entry);
        return (
          <li key={entry.id}>
            <button
              type="button"
              onClick={() => toggleFromLibrary(entry)}
              className={cn(
                "w-full min-w-0 flex items-center justify-between gap-3 text-left rounded-2xl px-4 py-3 min-h-[52px] transition-colors overflow-hidden",
                selectedRow
                  ? "bg-primary/15 border border-primary/40"
                  : "bg-card border border-border hover:bg-secondary/80",
              )}
            >
              <span className="min-w-0 flex-1 truncate text-left text-[15px] text-foreground font-normal whitespace-nowrap">
                {entry.name}
              </span>
              <span
                className={cn(
                  "shrink-0 ml-3 text-[12px] px-2.5 py-1 rounded-full",
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
  );

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
      {!embedded ? (
        <button
          type="button"
          onClick={handleDone}
          disabled={!canConfirmEmpty && local.length === 0}
          className="mt-4 w-full bg-primary text-primary-foreground py-3.5 rounded-2xl text-[16px] font-semibold disabled:opacity-40 shrink-0"
        >
          {doneLabel}
        </button>
      ) : null}
    </div>
  );

  const body = (
    <>
      {!embedded ? (
        <div className="px-page pt-10 pb-3 shrink-0 md:pt-6">
          <h2 id={titleId} className="text-[20px] font-semibold text-foreground leading-snug">
            {title}
          </h2>
          <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
            {subtitle}
          </p>
        </div>
      ) : (
        <span id={titleId} className="sr-only">
          {title}
        </span>
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
              <div className="px-page md:px-0 pb-3 space-y-3 shrink-0">{cuisineTabRows}</div>

              <div className="px-page md:px-0 pb-3 shrink-0">
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

              <div
                className={cn(
                  "flex-1 min-h-0 overflow-y-auto px-page md:px-0",
                  embedded ? "pb-6 md:overflow-visible md:pb-32" : "pb-[200px] md:pb-0 md:overflow-y-auto",
                )}
              >
                {mealList}

                {showAddCustom && (
                  <button
                    type="button"
                    onClick={addCustom}
                    className="mt-3 w-full text-left rounded-2xl px-4 py-3 border border-dashed border-border text-[15px] text-primary font-medium bg-card"
                  >
                    Add &quot;{trimmed}&quot; as a custom {mode === "aspirations" ? "wishlist meal" : "staple"}
                  </button>
                )}
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
                  <p className="text-[12px] text-muted-foreground font-medium">
                    {local.length} selected
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {mobilePreview.map((m) => (
                      <span
                        key={m.id}
                        className="inline-flex max-w-[100px] items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[12px] text-foreground"
                      >
                        <span className="truncate">{m.name}</span>
                        {m.custom ? (
                          <span className="shrink-0 text-[10px] px-1 py-0.5 rounded-full bg-background text-muted-foreground">
                            Custom
                          </span>
                        ) : null}
                      </span>
                    ))}
                    {mobileMore > 0 ? (
                      <span className="text-[12px] text-muted-foreground font-medium">+{mobileMore} more</span>
                    ) : null}
                  </div>
                </>
              )}
            </div>
            {!embedded ? (
              <button
                type="button"
                onClick={handleDone}
                disabled={!canConfirmEmpty && local.length === 0}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl text-[16px] font-semibold disabled:opacity-40"
              >
                {doneLabel}
              </button>
            ) : null}
          </div>
    </>
  );

  if (embedded) {
    return (
      <div className="flex flex-col flex-1 min-h-0 -mx-page px-page" role="region" aria-labelledby={titleId}>
        {body}
      </div>
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
