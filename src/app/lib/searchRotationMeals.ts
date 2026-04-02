import Fuse from 'fuse.js';

import type { Staple } from './api';
import libraryJson from '../data/rotation-meal-library.json';

export interface RotationLibraryEntry {
  id: string;
  name: string;
  cuisine: string;
  complexityTier?: 'simple' | 'moderate' | 'complex';
  aliases?: string[];
}

const library = libraryJson as RotationLibraryEntry[];

export function getRotationLibrary(): readonly RotationLibraryEntry[] {
  return library;
}

export function createRotationFuse(): Fuse<RotationLibraryEntry> {
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

const fuseSingleton = createRotationFuse();

/**
 * Returns ranked library matches. Empty query returns the first chunk of the catalog for browsing.
 */
export function searchRotationMeals(query: string, fuse: Fuse<RotationLibraryEntry> = fuseSingleton): RotationLibraryEntry[] {
  const q = query.trim();
  if (!q) {
    return [...library];
  }
  return fuse.search(q).map((r) => r.item);
}

export function libraryEntryToStaple(entry: RotationLibraryEntry): Staple {
  return {
    id: entry.id,
    name: entry.name,
    cuisine: entry.cuisine,
    complexityTier: entry.complexityTier,
    custom: false,
    libraryMealId: entry.id,
  };
}

/** @deprecated Use libraryEntryToStaple */
export const libraryEntryToRotationMeal = libraryEntryToStaple;
