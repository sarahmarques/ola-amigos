"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { getWord } from "@/content";
import { avatarWordIds, type AvatarId } from "@/content/avatars";
import { play, playSequence, promptClip, stopAll, wordClip } from "@/lib/audio";
import { MAX_PROFILES, useProgress } from "@/lib/progress-store";
import { Mascot } from "@/components/ui/Mascot";

/**
 * "Who's playing?" — no typing, no names: each child is an animal friend,
 * and hears that animal's Portuguese name when they pick it.
 */
export function ProfilePicker() {
  const profiles = useProgress((s) => s.profiles);
  const addProfile = useProgress((s) => s.addProfile);
  const selectProfile = useProgress((s) => s.selectProfile);
  const [adding, setAdding] = useState(profiles.length === 0);

  useEffect(() => {
    play(promptClip(adding ? "pick-an-animal" : "who-is-playing"));
    return stopAll;
  }, [adding]);

  const pick = (avatar: AvatarId, profileId?: string) => {
    playSequence([wordClip(avatar), wordClip(avatar, "en")]);
    if (profileId) selectProfile(profileId);
    else addProfile(avatar);
  };

  const options: { avatar: AvatarId; profileId?: string }[] = adding
    ? avatarWordIds.map((avatar) => ({ avatar }))
    : profiles.map((p) => ({ avatar: p.avatar, profileId: p.id }));

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Mascot
        says={{ en: adding ? "Pick an animal friend!" : "Who's playing? Tap your animal!" }}
        size={170}
      />
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
        {options.map(({ avatar, profileId }, i) => {
          const w = getWord(avatar);
          return (
            <motion.button
              key={profileId ?? avatar}
              type="button"
              onClick={() => pick(avatar, profileId)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              whileTap={{ scale: 0.92 }}
              aria-label={`${w.pt} — ${w.en}`}
              className="flex h-40 w-36 flex-col items-center justify-center gap-1 rounded-[2rem] bg-white shadow-[0_8px_0_rgba(47,98,73,0.2)] sm:w-40"
            >
              <span aria-hidden className="text-7xl">
                {w.emoji}
              </span>
              <span lang="pt-PT" className="text-xl font-bold text-gum-deep">
                {w.pt}
              </span>
            </motion.button>
          );
        })}
        {!adding && profiles.length < MAX_PROFILES && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            aria-label="Add a new player"
            className="grid h-40 w-36 place-items-center rounded-[2rem] border-4 border-dashed border-gum/40 text-6xl text-gum sm:w-40"
          >
            +
          </button>
        )}
      </div>
      {adding && profiles.length > 0 && (
        <button type="button" onClick={() => setAdding(false)} className="text-lg text-slate-600 underline">
          Back
        </button>
      )}
    </div>
  );
}
