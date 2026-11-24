import { describe, expect, it } from "vitest";
import { buildListenTapRounds, buildMemoryDeck, isPair, shuffle } from "./rounds";

/** Small deterministic random generator so tests are repeatable. */
const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

describe("shuffle", () => {
  it("keeps every item and does not mutate the input", () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input, seeded(1));
    expect([...out].sort()).toEqual(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("buildListenTapRounds", () => {
  const words = ["ola", "adeus", "bom-dia", "boa-noite", "sim"];

  it.each([2, 3, 4])("asks every word once, each round with %i distinct options including the answer", (choices) => {
    for (let seed = 1; seed < 30; seed++) {
      const rounds = buildListenTapRounds(words, choices, seeded(seed));
      expect(rounds.map((r) => r.answer).sort()).toEqual([...words].sort());
      for (const r of rounds) {
        expect(r.options).toHaveLength(choices);
        expect(new Set(r.options).size).toBe(choices);
        expect(r.options).toContain(r.answer);
        r.options.forEach((o) => expect(words).toContain(o));
      }
    }
  });

  it("never offers more options than there are words", () => {
    const rounds = buildListenTapRounds(["sim", "nao"], 4, seeded(3));
    rounds.forEach((r) => expect(r.options).toHaveLength(2));
  });
});

describe("buildMemoryDeck", () => {
  const words = ["contente", "triste", "zangada", "com-sono"];

  it("has one picture card and one sound card per word, with unique keys", () => {
    const deck = buildMemoryDeck(words, seeded(7));
    expect(deck).toHaveLength(words.length * 2);
    expect(new Set(deck.map((c) => c.key)).size).toBe(deck.length);
    for (const w of words) {
      const cards = deck.filter((c) => c.wordId === w);
      expect(cards.map((c) => c.kind).sort()).toEqual(["picture", "sound"]);
    }
  });

  it("matches only a picture and a sound card of the same word", () => {
    const deck = buildMemoryDeck(words, seeded(2));
    const find = (wordId: string, kind: "picture" | "sound") => deck.find((c) => c.wordId === wordId && c.kind === kind)!;
    expect(isPair(find("triste", "picture"), find("triste", "sound"))).toBe(true);
    expect(isPair(find("triste", "sound"), find("triste", "picture"))).toBe(true);
    expect(isPair(find("triste", "picture"), find("zangada", "sound"))).toBe(false);
    expect(isPair(find("triste", "picture"), find("zangada", "picture"))).toBe(false);
  });
});
