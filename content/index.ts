import type { Unit } from "@/lib/types";
import { olaUnits } from "./units/ola";

export { vocab, vocabById, getWord } from "./vocab";
export { prompts } from "./prompts";
export { trees } from "./trees";

/** Every unit, in teaching order. Trees 2–4 are added in Phase 5. */
export const units: Unit[] = [...olaUnits];

export const unitsForTree = (treeId: string) => units.filter((u) => u.treeId === treeId);

/** Praise words Lua uses in every unit, so they always get audio. */
export const praiseWordIds = ["muito-bem", "boa", "outra-vez"] as const;
