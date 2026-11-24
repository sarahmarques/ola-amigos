export type Rng = () => number;

export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type ListenTapRound = { answer: string; options: string[] };

/**
 * One round per word, in random order. Each round shows the answer plus
 * (choices − 1) other words from the same activity, shuffled.
 */
export function buildListenTapRounds(wordIds: string[], choices: number, rng: Rng = Math.random): ListenTapRound[] {
  const n = Math.min(choices, wordIds.length);
  return shuffle(wordIds, rng).map((answer) => {
    const others = shuffle(
      wordIds.filter((id) => id !== answer),
      rng,
    ).slice(0, n - 1);
    return { answer, options: shuffle([answer, ...others], rng) };
  });
}

export type MemoryCard = {
  /** Unique per card, e.g. "picture:ola". */
  key: string;
  wordId: string;
  /** A picture card shows the word's picture; a sound card says the word in Portuguese. */
  kind: "picture" | "sound";
};

/** Two cards per word, one picture and one sound, shuffled. */
export function buildMemoryDeck(wordIds: string[], rng: Rng = Math.random): MemoryCard[] {
  const cards = wordIds.flatMap((wordId): MemoryCard[] => [
    { key: `picture:${wordId}`, wordId, kind: "picture" },
    { key: `sound:${wordId}`, wordId, kind: "sound" },
  ]);
  return shuffle(cards, rng);
}

/** A pair is one picture card and one sound card for the same word. */
export const isPair = (a: MemoryCard, b: MemoryCard) => a.wordId === b.wordId && a.kind !== b.kind;
