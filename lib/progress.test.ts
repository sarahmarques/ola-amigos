import { describe, expect, it } from "vitest";
import { isTreeUnlocked, isUnitUnlocked, nextUnitId, treeProgress, type Completed } from "./progress";
import type { Unit } from "./types";

const unit = (id: string, treeId: string): Unit => ({
  id,
  treeId,
  title: { pt: id, en: id },
  emoji: "⭐",
  sticker: "🦘",
  wordIds: [],
  activities: [],
});

const treeIds = ["t1", "t2", "t3"];
const units = [unit("a", "t1"), unit("b", "t1"), unit("c", "t2")]; // t3 has no units yet
const done = (...ids: string[]): Completed => Object.fromEntries(ids.map((id) => [id, { completedAt: 1 }]));

describe("trees", () => {
  it("opens the first tree from the start", () => {
    expect(isTreeUnlocked("t1", treeIds, units, {})).toBe(true);
    expect(isTreeUnlocked("t2", treeIds, units, {})).toBe(false);
  });

  it("opens the next tree only when every unit of the previous one is finished", () => {
    expect(isTreeUnlocked("t2", treeIds, units, done("a"))).toBe(false);
    expect(isTreeUnlocked("t2", treeIds, units, done("a", "b"))).toBe(true);
  });

  it("keeps trees without units closed", () => {
    expect(isTreeUnlocked("t3", treeIds, units, done("a", "b", "c"))).toBe(false);
  });

  it("counts finished units", () => {
    expect(treeProgress("t1", units, done("a"))).toEqual({ done: 1, total: 2 });
  });
});

describe("units", () => {
  it("unlocks units one at a time and keeps finished ones playable", () => {
    expect(isUnitUnlocked("a", treeIds, units, {})).toBe(true);
    expect(isUnitUnlocked("b", treeIds, units, {})).toBe(false);
    expect(isUnitUnlocked("b", treeIds, units, done("a"))).toBe(true);
    expect(isUnitUnlocked("a", treeIds, units, done("a"))).toBe(true);
  });

  it("locks every unit of a locked tree", () => {
    expect(isUnitUnlocked("c", treeIds, units, done("a"))).toBe(false);
  });

  it("suggests the first unfinished unit", () => {
    expect(nextUnitId("t1", treeIds, units, {})).toBe("a");
    expect(nextUnitId("t1", treeIds, units, done("a"))).toBe("b");
    expect(nextUnitId("t1", treeIds, units, done("a", "b"))).toBeNull();
  });
});
