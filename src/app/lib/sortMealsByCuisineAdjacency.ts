import { CUISINE_ADJACENCY } from '../../constants/cuisineAdjacency';
import type { Staple } from './api';
import type { RotationLibraryEntry } from './searchRotationMeals';

/**
 * Boost meals whose cuisine appears in adjacency lists for the user's rotation cuisines.
 * No filtering — stable secondary sort by cuisine, then name.
 */
export function sortLibraryEntriesForAspirations(
  entries: readonly RotationLibraryEntry[],
  rotationStaples: readonly Staple[],
): RotationLibraryEntry[] {
  const rotationCuisines = [
    ...new Set(rotationStaples.map((s) => s.cuisine).filter(Boolean)),
  ];
  const boosted = new Set<string>();
  for (const c of rotationCuisines) {
    const adj = CUISINE_ADJACENCY[c];
    if (!adj) continue;
    for (const x of adj) {
      boosted.add(x);
    }
  }

  const scored = entries.map((e) => {
    const isBoosted = boosted.has(e.cuisine);
    return { e, isBoosted };
  });

  scored.sort((a, b) => {
    if (a.isBoosted !== b.isBoosted) return a.isBoosted ? -1 : 1;
    const c = a.e.cuisine.localeCompare(b.e.cuisine);
    if (c !== 0) return c;
    return a.e.name.localeCompare(b.e.name);
  });

  return scored.map((x) => x.e);
}
