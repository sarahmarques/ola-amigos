"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getWord } from "@/content";
import { playSequence, promptClip, stopAll, wordClip } from "@/lib/audio";
import { buildMemoryDeck, isPair, type MemoryCard } from "@/lib/rounds";
import type { ActivityProps } from "./types";

const PRAISE = ["muito-bem", "boa"] as const;
/** Shortest time two unmatched cards stay face up, even when sound is off. */
const MISMATCH_HOLD_MS = 1200;
/** Pause after the last pair before moving on, even when sound is off. */
const FINISH_HOLD_MS = 900;

const INSTRUCTION = { en: "Find the pairs! Tap two cards that go together." };
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Pares: every word has a picture card and a sound card, all face down.
 * Turning a sound card says the word in Portuguese; match it to its picture.
 * Cards that don't match turn back over — there is no failing.
 */
export function MemoryMatch({ activity, onDone, lua }: ActivityProps<"memory-match">) {
  // Built once on mount (client only), so the layout is random each time.
  const [deck] = useState(() => buildMemoryDeck(activity.wordIds));
  const [faceUp, setFaceUp] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const pairsFound = useRef(0);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    lua(INSTRUCTION, "talking");
    playSequence([promptClip("find-the-pairs")]).then((finished) => finished && lua(INSTRUCTION, "idle"));
    return () => {
      alive.current = false;
      stopAll();
    };
  }, [lua]);

  const say = (wordId: string) => {
    const w = getWord(wordId);
    lua({ pt: w.pt, en: "Can you find its picture?" }, "talking");
    playSequence([wordClip(wordId)]).then((finished) => finished && lua({ pt: w.pt, en: "Can you find its picture?" }, "idle"));
  };

  const tap = (card: MemoryCard) => {
    if (busy) return;

    // Tapping a finished pair just says the word again.
    if (matched.includes(card.wordId)) {
      const w = getWord(card.wordId);
      lua({ pt: w.pt, en: w.en }, "talking");
      playSequence([wordClip(card.wordId)]).then((finished) => finished && lua({ pt: w.pt, en: w.en }, "idle"));
      return;
    }
    if (faceUp.includes(card.key)) {
      if (card.kind === "sound") say(card.wordId);
      return;
    }

    const first = deck.find((c) => c.key === faceUp[0]);
    setFaceUp([...faceUp, card.key]);

    if (!first) {
      if (card.kind === "sound") say(card.wordId);
      else lua({ en: "Now find the card that says it!" }, "idle");
      return;
    }

    if (isPair(first, card)) {
      const w = getWord(card.wordId);
      const praise = getWord(PRAISE[pairsFound.current % PRAISE.length]);
      pairsFound.current += 1;
      const allDone = pairsFound.current === activity.wordIds.length;
      setMatched((m) => [...m, card.wordId]);
      setFaceUp([]);
      lua({ pt: `${praise.pt} ${w.pt}`, en: w.en }, "cheer");
      const sequence = playSequence([wordClip(praise.id), wordClip(w.id), wordClip(w.id, "en")]);
      if (allDone) {
        // Lock taps so only leaving the unit can interrupt the last praise.
        setBusy(true);
        Promise.all([sequence, wait(FINISH_HOLD_MS)]).then(([finished]) => finished && alive.current && onDone());
      }
      // Otherwise the child can keep playing while Lua talks.
    } else {
      setBusy(true);
      lua({ en: "Not a pair. Try again!" }, "talking");
      const clips = card.kind === "sound" ? [wordClip(card.wordId), promptClip("not-a-pair")] : [promptClip("not-a-pair")];
      Promise.all([playSequence(clips), wait(MISMATCH_HOLD_MS)]).then(() => {
        if (!alive.current) return;
        setFaceUp([]);
        setBusy(false);
        lua(INSTRUCTION, "idle");
      });
    }
  };

  return (
    <div className="grid w-full max-w-2xl grid-cols-4 justify-items-center gap-2 sm:gap-4">
      {deck.map((card) => (
        <FlipCard
          key={card.key}
          card={card}
          faceUp={faceUp.includes(card.key) || matched.includes(card.wordId)}
          matched={matched.includes(card.wordId)}
          onTap={() => tap(card)}
        />
      ))}
    </div>
  );
}

function FlipCard({
  card,
  faceUp,
  matched,
  onTap,
}: {
  card: MemoryCard;
  faceUp: boolean;
  matched: boolean;
  onTap: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const w = getWord(card.wordId);
  const label = !faceUp
    ? "Card, face down"
    : card.kind === "picture"
      ? `Picture: ${w.en}`
      : `Sound card: ${w.pt}`;

  const face =
    "absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-3xl border-4 px-1 [backface-visibility:hidden] shadow-[0_6px_0_rgba(47,98,73,0.2)]";

  return (
    <button
      type="button"
      onClick={onTap}
      aria-label={label}
      className="h-32 w-full max-w-[9rem] [perspective:800px] sm:h-44"
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        initial={false}
        animate={{ rotateY: faceUp ? 180 : 0, scale: matched && !reduceMotion ? [1, 1.08, 1] : 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.4 }}
      >
        {/* Back: a eucalyptus leaf */}
        <div aria-hidden className={`${face} border-white bg-gum text-4xl sm:text-6xl`}>
          🍃
        </div>
        {/* Front */}
        <div
          aria-hidden
          className={`${face} [transform:rotateY(180deg)] ${matched ? "border-gum bg-mint" : "border-white bg-white"}`}
        >
          {card.kind === "picture" ? (
            <>
              <span className="text-4xl leading-none sm:text-6xl">{w.emoji}</span>
              <span className="text-center text-xs leading-tight font-bold text-ink sm:text-base">{w.en}</span>
            </>
          ) : (
            <>
              <span className="text-4xl leading-none sm:text-6xl">🔊</span>
              <span lang="pt-PT" className="text-center text-xs leading-tight font-bold text-gum-deep sm:text-base">
                {w.pt}
              </span>
            </>
          )}
        </div>
      </motion.div>
    </button>
  );
}
