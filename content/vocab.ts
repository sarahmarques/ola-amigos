import type { Word } from "@/lib/types";

/**
 * Word bank — European Portuguese (pt-PT) only.
 * `hint` is a rough guide for English-speaking parents; the audio is the reference.
 * Every entry still needs a native Portugal speaker's review before launch.
 */
export const vocab: Word[] = [
  // ── Tree 1 · Unit: Greetings ────────────────────────────────────────
  { id: "ola", pt: "Olá!", en: "Hello!", emoji: "👋", hint: "oh-LAH" },
  { id: "adeus", pt: "Adeus!", en: "Goodbye!", emoji: "🙋", hint: "uh-DAY-oosh" },
  { id: "bom-dia", pt: "Bom dia!", en: "Good morning!", emoji: "🌅", hint: "bong DEE-uh", note: "The 'm' is nasal — don't close your lips fully." },
  { id: "boa-tarde", pt: "Boa tarde!", en: "Good afternoon!", emoji: "☀️", hint: "BOH-uh TAR-d", note: "The final 'e' is almost silent in Portugal." },
  { id: "boa-noite", pt: "Boa noite!", en: "Good night!", emoji: "🌙", hint: "BOH-uh NOY-t" },
  { id: "obrigado", pt: "Obrigado!", en: "Thank you! (said by a boy)", emoji: "🙏", hint: "oh-bree-GAH-doo", gender: "m", note: "Boys say obrigado." },
  { id: "obrigada", pt: "Obrigada!", en: "Thank you! (said by a girl)", emoji: "🙏", hint: "oh-bree-GAH-duh", gender: "f", note: "Girls say obrigada." },
  { id: "por-favor", pt: "Por favor", en: "Please", emoji: "🥺", hint: "poor fuh-VOR" },
  { id: "sim", pt: "Sim", en: "Yes", emoji: "👍", hint: "seeng", note: "Nasal ending — don't pronounce a hard 'g'." },
  { id: "nao", pt: "Não", en: "No", emoji: "👎", hint: "nowng", note: "The nasal 'ão' sound — like 'now' said through your nose." },

  // ── Tree 1 · Unit: My name ──────────────────────────────────────────
  { id: "como-te-chamas", pt: "Como te chamas?", en: "What's your name?", emoji: "❓", hint: "KOH-moo t' SHUH-mush", note: "Uses 'tu' — how you talk to a child in Portugal." },
  { id: "chamo-me", pt: "Chamo-me…", en: "My name is…", emoji: "🙋‍♀️", hint: "SHUH-moo-m'", note: "In Portugal the 'me' goes after the verb: Chamo-me." },
  { id: "eu-sou", pt: "Eu sou…", en: "I am…", emoji: "💁‍♀️", hint: "AY-oo soh" },
  { id: "o-menino", pt: "o menino", en: "the boy", emoji: "👦", hint: "oo m'-NEE-noo", gender: "m" },
  { id: "a-menina", pt: "a menina", en: "the girl", emoji: "👧", hint: "uh m'-NEE-nuh", gender: "f" },
  { id: "o-amigo", pt: "o amigo", en: "the friend (boy)", emoji: "🧑‍🤝‍🧑", hint: "oo uh-MEE-goo", gender: "m" },
  { id: "a-amiga", pt: "a amiga", en: "the friend (girl)", emoji: "👭", hint: "uh uh-MEE-guh", gender: "f" },
  { id: "muito-prazer", pt: "Muito prazer!", en: "Nice to meet you!", emoji: "🤝", hint: "MWEENG-too pruh-ZER" },

  // ── Tree 1 · Unit: Feelings ─────────────────────────────────────────
  { id: "como-estas", pt: "Como estás?", en: "How are you?", emoji: "💭", hint: "KOH-moo shTAHSH", note: "In Portugal 'estás' sounds like 'shtash'." },
  { id: "estou-bem", pt: "Estou bem!", en: "I'm fine!", emoji: "😀", hint: "shtoh BAYNG" },
  { id: "contente", pt: "contente", en: "happy", emoji: "😊", hint: "kon-TENT" },
  { id: "triste", pt: "triste", en: "sad", emoji: "😢", hint: "TREESHT" },
  { id: "zangado", pt: "zangado", en: "angry (boy)", emoji: "😠", hint: "zan-GAH-doo", gender: "m" },
  { id: "zangada", pt: "zangada", en: "angry (girl)", emoji: "😠", hint: "zan-GAH-duh", gender: "f" },
  { id: "cansado", pt: "cansado", en: "tired (boy)", emoji: "🥱", hint: "kan-SAH-doo", gender: "m" },
  { id: "cansada", pt: "cansada", en: "tired (girl)", emoji: "🥱", hint: "kan-SAH-duh", gender: "f" },
  { id: "com-fome", pt: "com fome", en: "hungry", emoji: "😋", hint: "kong FOM" },
  { id: "com-sono", pt: "com sono", en: "sleepy", emoji: "😴", hint: "kong SOH-noo" },

  // ── Profile animals (Lua's friends) — children pick one and hear its name ──
  { id: "o-coala", pt: "o coala", en: "the koala", emoji: "🐨", hint: "oo koh-AH-luh", gender: "m" },
  { id: "o-canguru", pt: "o canguru", en: "the kangaroo", emoji: "🦘", hint: "oo kan-goo-ROO", gender: "m" },
  { id: "a-coruja", pt: "a coruja", en: "the owl", emoji: "🦉", hint: "uh koo-ROO-zhuh", gender: "f" },
  { id: "a-tartaruga", pt: "a tartaruga", en: "the turtle", emoji: "🐢", hint: "uh tar-tuh-ROO-guh", gender: "f" },
  { id: "o-papagaio", pt: "o papagaio", en: "the parrot", emoji: "🦜", hint: "oo puh-puh-GUY-oo", gender: "m" },
  { id: "o-pinguim", pt: "o pinguim", en: "the penguin", emoji: "🐧", hint: "oo peeng-GWEENG", gender: "m" },

  // ── Praise Lua uses in every unit (learned by hearing them) ──────────
  { id: "muito-bem", pt: "Muito bem!", en: "Well done!", emoji: "🌟", hint: "MWEENG-too BAYNG" },
  { id: "boa", pt: "Boa!", en: "Great!", emoji: "🎉", hint: "BOH-uh" },
  { id: "outra-vez", pt: "Outra vez!", en: "Again!", emoji: "🔁", hint: "OH-truh VAYSH" },
];

export const vocabById: ReadonlyMap<string, Word> = new Map(vocab.map((w) => [w.id, w]));

export function getWord(id: string): Word {
  const word = vocabById.get(id);
  if (!word) throw new Error(`Unknown word id: ${id}`);
  return word;
}
