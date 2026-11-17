import { describe, expect, it } from "vitest";
import { buildListenTapRounds, shuffle } from "./rounds";

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
