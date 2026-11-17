"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mascot, type MascotLine, type MascotMood } from "@/components/ui/Mascot";
import { EucalyptusBranch } from "@/components/ui/EucalyptusBranch";
import { ProfilePicker } from "@/components/home/ProfilePicker";
import { getWord, trees, units } from "@/content";
import { setMuted } from "@/lib/audio";
import { isTreeUnlocked, treeProgress } from "@/lib/progress";
import { useActiveProfile, useProgress, useProgressHydrated } from "@/lib/progress-store";

export default function Home() {
  const router = useRouter();
  const hydrated = useProgressHydrated();
  const profile = useActiveProfile();
  const selectProfile = useProgress((s) => s.selectProfile);
  const soundOn = useProgress((s) => s.soundOn);
  const [mood, setMood] = useState<MascotMood>("idle");
  const [says, setSays] = useState<MascotLine>({ pt: "Olá!", en: "Hello! Let's learn Portuguese!" });

  useEffect(() => setMuted(!soundOn), [soundOn]);

  const treeIds = trees.map((t) => t.id);

  return (
    <main className="relative mx-auto flex min-h-dvh max-w-5xl flex-col items-center gap-8 overflow-x-clip px-4 py-8">
      <EucalyptusBranch className="absolute -top-2 -left-6 w-40 sm:w-60" />
      <EucalyptusBranch flip className="absolute -top-2 -right-6 hidden w-60 sm:block" />

      <Link
        href="/pais/"
        className="absolute top-4 right-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/80 text-xl shadow"
        aria-label="Parent area"
      >
        👪
      </Link>

      <h1 className="sr-only">Olá Amigos</h1>

      {!hydrated ? null : !profile ? (
        <div className="relative z-10 mt-4 w-full">
          <ProfilePicker />
        </div>
      ) : (
        <>
          {/* Who's playing — tap to switch */}
          <button
            type="button"
            onClick={() => selectProfile(null)}
            aria-label="Change player"
            className="absolute top-4 left-4 z-10 grid h-16 w-16 place-items-center rounded-full bg-white text-4xl shadow-lg"
          >
            {getWord(profile.avatar).emoji}
          </button>

          <button
            type="button"
            aria-label="Tap Lua the koala"
            className="relative z-10 mt-4"
            onClick={() => {
              setMood("cheer");
              setSays({ pt: "Eu sou a Lua!", en: "I'm Lua the koala!" });
              setTimeout(() => setMood("idle"), 1600);
            }}
          >
            <Mascot says={says} mood={mood} size={190} />
          </button>

          {profile.stickers.length > 0 && (
            <p aria-label={`Your stickers: ${profile.stickers.length}`} className="-mt-4 text-4xl tracking-widest">
              {profile.stickers.join("")}
            </p>
          )}

          <section aria-label="Learning trees" className="grid w-full grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {trees.map((tree, i) => {
              const unlocked = isTreeUnlocked(tree.id, treeIds, units, profile.completed);
              const { done, total } = treeProgress(tree.id, units, profile.completed);
              return (
                <motion.div
                  key={tree.id}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, type: "spring", stiffness: 200, damping: 20 }}
                >
                  <button
                    type="button"
                    disabled={!unlocked}
                    onClick={() => router.push(`/arvore/${tree.id}/`)}
                    className="group flex w-full flex-col items-center transition-transform active:translate-y-2 disabled:opacity-60 disabled:grayscale-[0.6]"
                  >
                    {/* Canopy */}
                    <span
                      className="relative flex h-40 w-full flex-col items-center justify-center gap-1 rounded-[50%_50%_45%_45%/60%_60%_40%_40%] border-4 border-gum-deep/30 text-ink shadow-[0_10px_0_rgba(47,98,73,0.25)]"
                      style={{ background: tree.colour }}
                    >
                      <span className="text-5xl transition-transform group-enabled:group-hover:scale-110">
                        {tree.emoji}
                      </span>
                      <span lang="pt-PT" className="text-3xl font-bold">
                        {tree.name}
                      </span>
                      <span className="text-lg font-bold text-ink/70">{tree.en}</span>
                      {!unlocked && (
                        <span aria-label="locked" className="absolute top-3 right-8 text-3xl">
                          🔒
                        </span>
                      )}
                      {unlocked && total > 0 && (
                        <span
                          aria-label={`${done} of ${total} finished`}
                          className="absolute top-3 right-8 rounded-full bg-white/80 px-3 py-1 text-base font-bold"
                        >
                          {done}/{total}
                        </span>
                      )}
                    </span>
                    {/* Trunk */}
                    <span aria-hidden className="h-8 w-10 rounded-b-lg bg-bark" />
                  </button>
                </motion.div>
              );
            })}
          </section>
        </>
      )}
    </main>
  );
}
