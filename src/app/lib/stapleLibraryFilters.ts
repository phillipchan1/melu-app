import type { StapleLibraryEntry } from './searchStapleMeals';

/** Canonical tab id; `all` shows every cuisine. */
export type StapleCuisineTabId =
  | 'all'
  | 'Mexican'
  | 'Italian'
  | 'American'
  | 'Asian'
  | 'Mediterranean'
  | 'Indian'
  | 'Middle Eastern'
  | 'French';

export const STAPLE_CUISINE_TAB_ALL: StapleCuisineTabId = 'all';

/** Primary row (horizontal scroll); Mediterranean includes Greek library items. */
export const STAPLE_CUISINE_TABS_PRIMARY: ReadonlyArray<{ id: StapleCuisineTabId; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'Mexican', label: 'Mexican' },
  { id: 'Italian', label: 'Italian' },
  { id: 'American', label: 'American' },
  { id: 'Asian', label: 'Asian' },
  { id: 'Mediterranean', label: 'Mediterranean' },
] as const;

/** Shown in expandable “more” region (same behavior as primary; split for layout spec). */
export const STAPLE_CUISINE_TABS_EXTRA: ReadonlyArray<{ id: StapleCuisineTabId; label: string }> = [
  { id: 'Indian', label: 'Indian' },
  { id: 'Middle Eastern', label: 'Middle Eastern' },
  { id: 'French', label: 'French' },
] as const;

/**
 * Whether a library row belongs to the active cuisine tab.
 * Mediterranean tab includes Greek + Mediterranean entries from the JSON catalog.
 */
export function cuisineMatchesStapleTab(entry: StapleLibraryEntry, tabId: StapleCuisineTabId): boolean {
  if (tabId === 'all') return true;
  if (tabId === 'Mediterranean') {
    return entry.cuisine === 'Mediterranean' || entry.cuisine === 'Greek';
  }
  return entry.cuisine === tabId;
}

export function filterEntriesByCuisineTab(
  entries: StapleLibraryEntry[],
  tabId: StapleCuisineTabId,
): StapleLibraryEntry[] {
  if (tabId === 'all') return entries;
  return entries.filter((e) => cuisineMatchesStapleTab(e, tabId));
}
