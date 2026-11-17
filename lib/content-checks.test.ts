import { describe, expect, it } from "vitest";
import { checkContent, findBrazilianisms } from "./content-checks";
import { vocab, units, trees, prompts } from "@/content";
import type { Unit, Word } from "./types";

describe("findBrazilianisms", () => {
  it.each([
    ["Como você se chama?", "você"],
    ["Vamos de ônibus", "ônibus"],
    ["Quero suco", "suco"],
    ["O café da manhã", "café da manhã"],
    ["Oi!", "oi"],
    ["Tchau!", "tchau"],
    ["O bebê dorme", "bebê"],
  ])("flags Brazilian vocabulary in %j", (text, word) => {
    expect(findBrazilianisms(text).join(" ")).toContain(`"${word}"`);
  });

  it("flags the Brazilian gerund progressive", () => {
    expect(findBrazilianisms("Estou comendo")[0]).toMatch(/estar a \+ infinitive/);
  });

  it("flags a sentence that starts with a pronoun", () => {
    expect(findBrazilianisms("Me chamo Ana.")[0]).toMatch(/Chamo-me/);
  });

  it.each([
    "Chamo-me Ana.",
    "Estou a comer.",
    "Olá! Bom dia!",
    "Como te chamas?",
    "Vocês querem sumo?",
    "Tenho dois gatos.", // "oi" inside "dois" must not match
    "O autocarro e o comboio",
    "Muito bem!",
  ])("accepts European Portuguese: %j", (text) => {
    expect(findBrazilianisms(text)).toEqual([]);
  });
});

describe("checkContent", () => {
  const word = (id: string, pt = id): Word => ({ id, pt, en: id, emoji: "⭐", hint: id });
  const unit = (overrides: Partial<Unit> = {}): Unit => ({
    id: "u1",
    treeId: "ola",
    title: { pt: "Teste", en: "Test" },
    emoji: "⭐",
    sticker: "🦘",
    wordIds: ["a", "b", "c"],
    activities: [{ type: "introduce", wordIds: ["a", "b", "c"] }],
    ...overrides,
  });
  const base = { vocab: [word("a"), word("b"), word("c")], treeIds: ["ola"], prompts: [] };

  it("passes valid content", () => {
    expect(checkContent({ ...base, units: [unit()] })).toEqual({ errors: [], warnings: [] });
  });

  it("reports unknown words, unknown trees and words outside the unit", () => {
    const { errors } = checkContent({
      ...base,
      units: [
        unit({
          treeId: "nope",
          wordIds: ["a", "b", "zzz"],
          activities: [{ type: "introduce", wordIds: ["a", "b", "c"] }],
        }),
      ],
    });
    expect(errors.join("\n")).toMatch(/unknown tree "nope"/);
    expect(errors.join("\n")).toMatch(/unknown word "zzz"/);
    expect(errors.join("\n")).toMatch(/word "c" is not in the unit/);
  });

  it("reports listen-tap with more choices than words", () => {
    const { errors } = checkContent({
      ...base,
      units: [unit({ activities: [{ type: "listen-tap", wordIds: ["a", "b"], choices: 3 }] })],
    });
    expect(errors.join("\n")).toMatch(/needs at least 3 words/);
  });

  it("reports listen-tap words that share a picture", () => {
    const { errors } = checkContent({
      ...base,
      vocab: [word("a"), word("b"), { ...word("c"), emoji: "🌙" }],
      units: [unit({ activities: [{ type: "listen-tap", wordIds: ["a", "b", "c"], choices: 2 }] })],
    });
    expect(errors.join("\n")).toMatch(/"a" and "b" share the picture ⭐/);
  });

  it("reports duplicate ids and Brazilian words in vocab", () => {
    const { errors } = checkContent({
      ...base,
      vocab: [...base.vocab, word("a"), word("suco", "suco")],
      units: [],
    });
    expect(errors.join("\n")).toMatch(/word "a": duplicate id/);
    expect(errors.join("\n")).toMatch(/"suco" is Brazilian; use sumo/);
  });

  it("treats missing audio as a warning, or an error when required", () => {
    const audio = { paths: ["/audio/pt/a.mp3"], exists: () => false };
    const input = { ...base, units: [unit()] };
    expect(checkContent(input, { ...audio, required: false }).warnings).toHaveLength(1);
    expect(checkContent(input, { ...audio, required: true }).errors).toHaveLength(1);
  });
});

describe("real content", () => {
  it("has no errors or warnings (apart from audio)", () => {
    expect(checkContent({ vocab, units, treeIds: trees.map((t) => t.id), prompts })).toEqual({
      errors: [],
      warnings: [],
    });
  });
});
