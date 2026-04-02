import Fuse from 'fuse.js';

import type { Staple } from './api';
import libraryJson from '../data/staple-meal-library.json';

export interface StapleLibraryEntry {
  id: string;
  name: string;
  cuisine: string;
  /** Default grid vs behind “show more” */
  tier: 'top' | 'overflow';
  complexityTier?: 'simple' | 'moderate' | 'complex';
  /** Search aliases for Fuse (e.g. “tofu”, “kimchi”) */
  aliases: string[];
}

const library = libraryJson as StapleLibraryEntry[];

function normKey(s: string): string {
  return s.trim().toLowerCase();
}

/** True if query exactly matches a library dish name or any alias (case-insensitive trim). */
export function libraryHasExactMatchForQuery(
  query: string,
  lib: readonly StapleLibraryEntry[] = library,
): boolean {
  const n = normKey(query);
  if (n.length === 0) return false;
  return lib.some((e) => {
    if (normKey(e.name) === n) return true;
    return e.aliases.some((a) => normKey(a) === n);
  });
}

export function getStapleLibrary(): readonly StapleLibraryEntry[] {
  return library;
}

export function createStapleFuse(): Fuse<StapleLibraryEntry> {
  return new Fuse(library, {
    keys: [
      { name: 'name', weight: 0.65 },
      { name: 'aliases', weight: 0.35 },
    ],
    threshold: 0.42,
    ignoreLocation: true,
    includeScore: true,
  });
}

const fuseSingleton = createStapleFuse();

/**
 * Returns ranked library matches. Empty query returns the first chunk of the catalog for browsing.
 */
export function searchStapleMeals(
  query: string,
  fuse: Fuse<StapleLibraryEntry> = fuseSingleton,
): StapleLibraryEntry[] {
  const q = query.trim();
  if (!q) {
    return [...library];
  }
  return fuse.search(q).map((r) => r.item);
}

export function libraryEntryToStaple(entry: StapleLibraryEntry): Staple {
  return {
    id: entry.id,
    name: entry.name,
    cuisine: entry.cuisine,
    complexityTier: entry.complexityTier,
    custom: false,
    libraryMealId: entry.id,
  };
}
