"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { trees, unitsForTree, units } from "@/content";
import { play, promptClip, stopAll } from "@/lib/audio";
import { isTreeUnlocked, isUnitUnlocked, nextUnitId } from "@/lib/progress";
import { useActiveProfile, useProgressHydrated } from "@/lib/progress-store";
import { Mascot } from "@/components/ui/Mascot";

/**
 * One learning tree: its units are branches up the trunk, bottom to top.
 * Lua sits on the branch to play next — she climbs as the child progresses.
 */
export function TreeView({ treeId }: { treeId: string }) {
  const router = useRouter();
  const hydrated = useProgressHydrated();
  const profile = useActiveProfile();
  const tree = trees.find((t) => t.id === treeId)!;
  const treeIds = trees.map((t) => t.id);
  const list = unitsForTree(treeId);

  const allowed = hydrated && profile !== null && isTreeUnlocked(treeId, treeIds, units, profile.completed);

  useEffect(() => {
    if (hydrated && !allowed) router.replace("/");
  }, [hydrated, allowed, router]);

  useEffect(() => {
    if (!allowed) return;
    play(promptClip("pick-a-unit"));
    return stopAll;
  }, [allowed]);

  if (!allowed || !profile) return null;

  const nextId = nextUnitId(treeId, treeIds, units, profile.completed);
  // Top of the tree first on screen; the first unit is the lowest branch.
  const branches = [...list].reverse();

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center gap-4 px-4 py-4">
      <header className="flex w-full items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/")}
          aria-label="Back to all trees"
          className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white/80 text-3xl shadow"
        >
          🏠
        </button>
        <h1 className="flex flex-1 flex-col items-center leading-tight">
          <span lang="pt-PT" className="text-3xl font-bold">
            {tree.emoji} {tree.name}
          </span>
          <span className="text-lg text-slate-600">{tree.en}</span>
        </h1>
        <span className="w-16 shrink-0" />
      </header>

      {/* Canopy */}
      <div
        aria-hidden
        className="-mb-6 h-16 w-64 rounded-[50%_50%_40%_40%/70%_70%_30%_30%] border-4 border-gum-deep/30"
        style={{ background: tree.colour }}
      />

      <ol className="relative flex w-full flex-col items-center gap-6 py-6">
        {/* Trunk */}
        <span aria-hidden className="absolute inset-y-0 left-1/2 w-10 -translate-x-1/2 rounded-full bg-bark" />

        {branches.map((unit, i) => {
          const unlocked = isUnitUnlocked(unit.id, treeIds, units, profile.completed);
          const done = Boolean(profile.completed[unit.id]);
          const isNext = unit.id === nextId;
          const left = i % 2 === 0;
          return (
            <li key={unit.id} className={`relative flex w-full items-center ${left ? "justify-start" : "justify-end"}`}>
              <motion.button
                type="button"
                disabled={!unlocked}
                onClick={() => router.push(`/unidade/${unit.id}/`)}
                initial={{ opacity: 0, x: left ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i }}
                whileTap={unlocked ? { scale: 0.94 } : undefined}
                aria-label={`${unit.title.pt} — ${unit.title.en}${done ? ", finished" : unlocked ? "" : ", locked"}`}
                className={`relative z-10 flex w-[46%] flex-col items-center gap-1 rounded-[2rem] border-4 bg-white p-4 shadow-[0_8px_0_rgba(47,98,73,0.2)] disabled:opacity-60 disabled:grayscale
                  ${isNext ? "border-wattle" : "border-white"}`}
              >
                <span aria-hidden className="text-5xl">
                  {done ? unit.sticker : unit.emoji}
                </span>
                <span lang="pt-PT" className="text-center text-xl font-bold text-gum-deep">
                  {unit.title.pt}
                </span>
                <span className="text-center text-sm text-slate-600">{unit.title.en}</span>
                {!unlocked && (
                  <span aria-hidden className="absolute -top-3 -right-3 text-3xl">
                    🔒
                  </span>
                )}
                {done && (
                  <span aria-hidden className="absolute -top-3 -right-3 text-3xl">
                    ⭐
                  </span>
                )}
              </motion.button>

              {isNext && (
                <div className={`absolute top-1/2 z-20 -translate-y-1/2 ${left ? "right-[4%]" : "left-[4%]"}`}>
                  <Mascot size={110} />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* Ground */}
      <div aria-hidden className="-mt-4 h-6 w-72 rounded-full bg-leaf/70" />
    </main>
  );
}
