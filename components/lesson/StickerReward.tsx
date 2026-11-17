"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { playSequence, promptClip, stopAll, wordClip } from "@/lib/audio";
import { BigButton } from "@/components/ui/BigButton";

type StickerRewardProps = {
  sticker: string;
  onBackToTree: () => void;
  onPlayAgain: () => void;
};

const LEAVES = Array.from({ length: 12 }, (_, i) => i);

/** End-of-unit celebration: a sticker pops in and eucalyptus leaves float down. */
export function StickerReward({ sticker, onBackToTree, onPlayAgain }: StickerRewardProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    playSequence([wordClip("muito-bem"), promptClip("unit-done")]);
    return stopAll;
  }, []);

  return (
    <div className="relative flex flex-col items-center gap-8 py-4">
      {!reduceMotion &&
        LEAVES.map((i) => (
          <motion.span
            key={i}
            aria-hidden
            className="pointer-events-none absolute top-0 text-3xl"
            style={{ left: `${(i * 83) % 100}%` }}
            initial={{ y: -40, opacity: 0, rotate: 0 }}
            animate={{ y: 360, opacity: [0, 1, 1, 0], rotate: i % 2 ? 200 : -200 }}
            transition={{ duration: 2.6, delay: i * 0.12, ease: "easeIn" }}
          >
            🍃
          </motion.span>
        ))}

      <motion.div
        initial={reduceMotion ? false : { scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 12, delay: 0.2 }}
        className="grid h-48 w-48 place-items-center rounded-full border-8 border-wattle bg-white text-[7rem] shadow-xl"
        role="img"
        aria-label="Your new sticker"
      >
        {sticker}
      </motion.div>

      <div className="flex flex-wrap justify-center gap-4">
        <BigButton colour="gum" size="lg" onClick={onBackToTree}>
          <span aria-hidden>🌳</span> Back to the tree
        </BigButton>
        <BigButton colour="wattle" size="lg" onClick={onPlayAgain}>
          <span aria-hidden>🔁</span> <span lang="pt-PT">Outra vez!</span>
        </BigButton>
      </div>
    </div>
  );
}
