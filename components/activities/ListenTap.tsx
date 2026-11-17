"use client";

import { useCallback, useEffect, useState } from "react";
import { getWord } from "@/content";
import { playSequence, promptClip, stopAll, wordClip } from "@/lib/audio";
import { buildListenTapRounds } from "@/lib/rounds";
import { PictureCard, type CardState } from "@/components/ui/PictureCard";
import { SpeakerButton } from "@/components/ui/SpeakerButton";
import type { ActivityProps } from "./types";

const PRAISE = ["muito-bem", "boa"] as const;

/** Hear a Portuguese word, tap its picture. Wrong taps wobble and the word replays. */
export function ListenTap({ activity, onDone, lua }: ActivityProps<"listen-tap">) {
  // Built once on mount (client only), so the order is random each time.
  const [rounds] = useState(() => buildListenTapRounds(activity.wordIds, activity.choices));
  const [index, setIndex] = useState(0);
  const [wrong, setWrong] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);

  const round = rounds[index];
  const answer = getWord(round.answer);

  const ask = useCallback(
    (withInstruction: boolean) => {
      lua({ pt: answer.pt, en: "Tap the right picture!" }, "talking");
      const clips = withInstruction
        ? [promptClip("listen-and-tap"), wordClip(answer.id)]
        : [wordClip(answer.id)];
      playSequence(clips).then((finished) => finished && lua({ pt: answer.pt, en: "Tap the right picture!" }, "idle"));
    },
    [answer, lua],
  );

  useEffect(() => {
    // Explain the game on the first round only.
    ask(index === 0);
    return stopAll;
  }, [ask, index]);

  const tap = (id: string) => {
    if (solved || wrong.includes(id)) return;
    if (id === answer.id) {
      setSolved(true);
      const praise = getWord(PRAISE[index % PRAISE.length]);
      lua({ pt: `${praise.pt} ${answer.pt}`, en: answer.en }, "cheer");
      playSequence([wordClip(praise.id), wordClip(answer.id, "en")]).then((finished) => {
        if (!finished) return;
        if (index + 1 < rounds.length) {
          setIndex(index + 1);
          setWrong([]);
          setSolved(false);
        } else {
          onDone();
        }
      });
    } else {
      setWrong((w) => [...w, id]);
      lua({ pt: answer.pt, en: "Oops! Let's listen again." }, "talking");
      playSequence([promptClip("try-again"), wordClip(answer.id)]).then(
        (finished) => finished && lua({ pt: answer.pt, en: "Tap the right picture!" }, "idle"),
      );
    }
  };

  const stateOf = (id: string): CardState =>
    solved && id === answer.id ? "correct" : wrong.includes(id) ? "wrong" : "idle";

  return (
    <div className="flex flex-col items-center gap-6">
      <div key={index} className="flex flex-wrap justify-center gap-4 sm:gap-6">
        {round.options.map((id) => {
          const w = getWord(id);
          return (
            <PictureCard
              key={id}
              emoji={w.emoji}
              label={w.en}
              state={stateOf(id)}
              onTap={() => tap(id)}
              disabled={solved}
            />
          );
        })}
      </div>
      <SpeakerButton onClick={() => ask(false)} />
    </div>
  );
}
