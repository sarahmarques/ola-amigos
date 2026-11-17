import type { Unit } from "./types";

/** unitId → when the child finished it. */
export type Completed = Record<string, { completedAt: number }>;

const treeUnits = (treeId: string, units: Unit[]) => units.filter((u) => u.treeId === treeId);

/**
 * Trees unlock in order: the first is always open; each later tree opens once
 * every unit of the tree before it is finished (and it has units of its own).
 */
export function isTreeUnlocked(treeId: string, treeIds: string[], units: Unit[], completed: Completed): boolean {
  const index = treeIds.indexOf(treeId);
  if (index < 0) return false;
  if (treeUnits(treeId, units).length === 0) return false;
  if (index === 0) return true;
  const previous = treeUnits(treeIds[index - 1], units);
  return previous.length > 0 && previous.every((u) => completed[u.id]);
}

/** Within an open tree, units unlock one at a time. Finished units stay playable. */
export function isUnitUnlocked(unitId: string, treeIds: string[], units: Unit[], completed: Completed): boolean {
  const unit = units.find((u) => u.id === unitId);
  if (!unit || !isTreeUnlocked(unit.treeId, treeIds, units, completed)) return false;
  const siblings = treeUnits(unit.treeId, units);
  const index = siblings.findIndex((u) => u.id === unitId);
  return index === 0 || Boolean(completed[siblings[index - 1].id]);
}

/** The unit Lua suggests next in a tree: the first unlocked one not yet finished. */
export function nextUnitId(treeId: string, treeIds: string[], units: Unit[], completed: Completed): string | null {
  return (
    treeUnits(treeId, units).find(
      (u) => !completed[u.id] && isUnitUnlocked(u.id, treeIds, units, completed),
    )?.id ?? null
  );
}

export function treeProgress(treeId: string, units: Unit[], completed: Completed) {
  const list = treeUnits(treeId, units);
  return { done: list.filter((u) => completed[u.id]).length, total: list.length };
}
