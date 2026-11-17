import type { Unit } from "@/lib/types";

/** Tree 1 · "Olá!" — first words for ages 3+. */
export const olaUnits: Unit[] = [
  {
    id: "cumprimentos",
    treeId: "ola",
    title: { pt: "Olá e adeus", en: "Hello and goodbye" },
    emoji: "👋",
    sticker: "🦘",
    wordIds: ["ola", "adeus", "bom-dia", "boa-tarde", "boa-noite", "obrigado", "obrigada", "por-favor", "sim", "nao"],
    activities: [
      { type: "introduce", wordIds: ["ola", "adeus", "bom-dia", "boa-tarde", "boa-noite"] },
      { type: "listen-tap", wordIds: ["ola", "adeus", "bom-dia", "boa-tarde", "boa-noite"], choices: 2 },
      { type: "introduce", wordIds: ["obrigado", "obrigada", "por-favor", "sim", "nao"] },
      { type: "repeat-with-me", wordIds: ["ola", "adeus", "obrigado", "obrigada", "por-favor"] },
      { type: "listen-tap", wordIds: ["sim", "nao", "por-favor", "bom-dia"], choices: 3 },
    ],
  },
  {
    id: "o-meu-nome",
    treeId: "ola",
    title: { pt: "O meu nome", en: "My name" },
    emoji: "🙋",
    sticker: "🦉",
    wordIds: ["como-te-chamas", "chamo-me", "eu-sou", "o-menino", "a-menina", "o-amigo", "a-amiga", "muito-prazer"],
    activities: [
      { type: "introduce", wordIds: ["como-te-chamas", "chamo-me", "eu-sou", "muito-prazer"] },
      { type: "repeat-with-me", wordIds: ["como-te-chamas", "chamo-me", "eu-sou", "muito-prazer"] },
      { type: "introduce", wordIds: ["o-menino", "a-menina", "o-amigo", "a-amiga"] },
      { type: "listen-tap", wordIds: ["o-menino", "a-menina", "o-amigo", "a-amiga"], choices: 2 },
      { type: "memory-match", wordIds: ["o-menino", "a-menina", "o-amigo", "a-amiga"] },
    ],
  },
  {
    id: "sentimentos",
    treeId: "ola",
    title: { pt: "Como estás?", en: "How are you?" },
    emoji: "😊",
    sticker: "🐨",
    wordIds: ["como-estas", "estou-bem", "contente", "triste", "zangado", "cansado", "com-fome", "com-sono"],
    activities: [
      { type: "introduce", wordIds: ["como-estas", "estou-bem", "contente", "triste"] },
      { type: "listen-tap", wordIds: ["contente", "triste", "estou-bem"], choices: 2 },
      { type: "introduce", wordIds: ["zangado", "cansado", "com-fome", "com-sono"] },
      { type: "repeat-with-me", wordIds: ["como-estas", "estou-bem", "contente", "triste"] },
      { type: "memory-match", wordIds: ["contente", "triste", "zangado", "com-sono"] },
      { type: "listen-tap", wordIds: ["contente", "triste", "zangado", "cansado", "com-fome", "com-sono"], choices: 3 },
    ],
  },
];
