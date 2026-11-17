"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getWord } from "@/content";
import { playSequence, promptClip, stopAll, wordClip } from "@/lib/audio";
import { PictureCard } from "@/components/ui/PictureCard";
import { NextButton, SpeakerButton } from "@/components/ui/SpeakerButton";
import type { ActivityProps } from "./types";

type Phase = "lua" | "child" | "again";
const CHILD_TURN_MS = 3500;

/**
 * Lua says it → the child says it out loud (no microphone, no scoring)
 * → Lua says it again so the child can compare.
 */
export function RepeatWithMe({ activity, onDone, lua }: ActivityProps<"repeat-with-me">) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("lua");
  const word = getWord(activity.wordIds[index]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();

  const run = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setPhase("lua");
    lua({ pt: word.pt, en: word.en }, "talking");
    playSequence([wordClip(word.id), promptClip("your-turn")]).then((finished) => {
      if (!finished) return;
      setPhase("child");
      lua({ en: "Your turn! Say it out loud." }, "idle");
      timer.current = setTimeout(() => {
        setPhase("again");
        lua({ pt: word.pt, en: word.en }, "talking");
        playSequence([wordClip(word.id)]).then((done) => done && lua({ pt: word.pt, en: word.en }, "cheer"));
      }, CHILD_TURN_MS);
    });
  }, [word, lua]);

  useEffect(() => {
    run();
    return () => {
      if (timer.current) clearTimeout(timer.current);
      stopAll();
    };
  }, [run]);

  const next = () => {
    if (index + 1 < activity.wordIds.length) setIndex(index + 1);
    else onDone();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <PictureCard key={word.id} emoji={word.emoji} label={word.en} size="lg" onTap={run} />
        {phase === "child" && (
          <motion.div
            aria-live="polite"
            className="absolute -top-4 -right-4 grid h-20 w-20 place-items-center rounded-full bg-wattle text-4xl shadow-lg"
            animate={reduceMotion ? {} : { scale: [1, 1.15, 1] }}
            transition={{ duration: 0.9, repeat: Infinity }}
          >
            <span role="img" aria-label="Your turn to speak">
              🗣️
            </span>
          </motion.div>
        )}
      </div>
      <div className="flex items-center gap-6">
        <SpeakerButton onClick={run} label="Start again" />
        <NextButton onClick={next} />
      </div>
    </div>
  );
}
