import type { Staple } from "./api";
import type { StapleLibraryEntry } from "./searchStapleMeals";
import { getStapleLibrary } from "./searchStapleMeals";

/** Grid tile ids — one tile per cuisine group in the library (French etc. are search-only). */
export type CuisineGridNodeId =
  | "Mexican"
  | "Italian"
  | "American"
  | "Asian"
  | "Mediterranean"
  | "Indian"
  | "Middle Eastern"
  | "Japanese"
  | "Korean"
  | "Chinese"
  | "Southeast Asian";

export const STAPLE_CUISINE_GRID_NODES: ReadonlyArray<{
  id: CuisineGridNodeId;
  label: string;
  emoji: string;
}> = [
  { id: "Mexican", label: "Mexican", emoji: "🌮" },
  { id: "Italian", label: "Italian", emoji: "🍝" },
  { id: "American", label: "American", emoji: "🍔" },
  { id: "Asian", label: "Asian", emoji: "🥢" },
  { id: "Mediterranean", label: "Mediterranean", emoji: "🫒" },
  { id: "Indian", label: "Indian", emoji: "🍛" },
  { id: "Middle Eastern", label: "Middle Eastern", emoji: "🧆" },
  { id: "Japanese", label: "Japanese", emoji: "🍱" },
  { id: "Korean", label: "Korean", emoji: "🥘" },
  { id: "Chinese", label: "Chinese", emoji: "🥡" },
  { id: "Southeast Asian", label: "Southeast Asian", emoji: "🌿" },
];

/** JSON `cuisine` string maps to one grid node id (or null = no tile, search-only). */
export function libraryCuisineToNodeId(cuisine: string): CuisineGridNodeId | null {
  const c = cuisine.trim();
  const match = STAPLE_CUISINE_GRID_NODES.find((n) => n.id === c);
  if (match) return match.id;
  if (c === "Greek") return "Mediterranean";
  return null;
}

export function entryBelongsToCuisineNode(entry: StapleLibraryEntry, nodeId: CuisineGridNodeId): boolean {
  const mapped = libraryCuisineToNodeId(entry.cuisine);
  return mapped === nodeId;
}

export function filterLibraryByNode(
  entries: readonly StapleLibraryEntry[],
  nodeId: CuisineGridNodeId,
): StapleLibraryEntry[] {
  return entries.filter((e) => entryBelongsToCuisineNode(e, nodeId));
}

export function countEntriesInNode(nodeId: CuisineGridNodeId): number {
  return getStapleLibrary().filter((e) => entryBelongsToCuisineNode(e, nodeId)).length;
}

export function partitionTopAndOverflow(
  entries: StapleLibraryEntry[],
): { top: StapleLibraryEntry[]; overflow: StapleLibraryEntry[] } {
  const top = entries.filter((e) => e.tier === "top");
  const overflow = entries.filter((e) => e.tier === "overflow");
  return { top, overflow };
}

/** Count staples in `local` that map to this cuisine node (by library id or cuisine field). */
export function countSelectedInNode(
  local: readonly Staple[],
  nodeId: CuisineGridNodeId,
  library: readonly StapleLibraryEntry[],
): number {
  const libIdsInNode = new Set(
    library.filter((e) => entryBelongsToCuisineNode(e, nodeId)).map((e) => e.id),
  );
  let n = 0;
  for (const s of local) {
    if (s.custom) {
      if (libraryCuisineToNodeId(s.cuisine) === nodeId) n += 1;
      continue;
    }
    const key =
      s.libraryMealId ?? (/^[\da-f-]{36}$/i.test(s.id) ? undefined : s.id);
    if (key && libIdsInNode.has(key)) n += 1;
  }
  return n;
}
