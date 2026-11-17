"use client";

import { useCallback, useEffect, useState } from "react";
import { getWord } from "@/content";
import { playSequence, stopAll, wordClip } from "@/lib/audio";
import { PictureCard } from "@/components/ui/PictureCard";
import { NextButton, SpeakerButton } from "@/components/ui/SpeakerButton";
import type { ActivityProps } from "./types";

/**
 * Meet new words: Portuguese → English meaning → Portuguese again,
 * so each word starts and ends in the language being learned.
 */
export function Introduce({ activity, onDone, lua }: ActivityProps<"introduce">) {
  const [index, setIndex] = useState(0);
  const word = getWord(activity.wordIds[index]);

  const say = useCallback(() => {
    lua({ pt: word.pt, en: word.en }, "talking");
    playSequence([wordClip(word.id, "pt"), wordClip(word.id, "en"), wordClip(word.id, "pt")]).then((finished) => {
      if (finished) lua({ pt: word.pt, en: word.en }, "idle");
    });
  }, [word, lua]);

  useEffect(() => {
    say();
    return stopAll;
  }, [say]);

  const next = () => {
    if (index + 1 < activity.wordIds.length) setIndex(index + 1);
    else onDone();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <PictureCard key={word.id} emoji={word.emoji} label={word.en} size="lg" onTap={say} />
      <div className="flex items-center gap-6">
        <SpeakerButton onClick={say} />
        <NextButton onClick={next} />
      </div>
    </div>
  );
}
