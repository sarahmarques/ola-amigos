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
