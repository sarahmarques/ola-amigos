/**
 * Content model. Learners are English-speaking children; everything they learn
 * is European Portuguese (pt-PT). All lesson content is typed data in /content.
 */

export type Gender = "m" | "f";

/** A word or short phrase being taught. */
export type Word = {
  /** Stable kebab-case id; also the audio file name. */
  id: string;
  /** European Portuguese (pt-PT). This is what the child learns. */
  pt: string;
  /** English meaning, spoken by the English voice. */
  en: string;
  /** Picture for now (emoji); replaced by illustrations later. */
  emoji: string;
  /** Rough pronunciation for English-speaking parents, e.g. "oh-LAH". */
  hint: string;
  /** Grammatical gender, where it matters to the child (obrigado / obrigada). */
  gender?: Gender;
  /** Short note for parents (shown in the parent area). */
  note?: string;
};

/** A line Lua says in English: instructions and prompts. */
export type Prompt = {
  id: string;
  en: string;
};

export type Activity =
  /** Hear each word in Portuguese with its picture, then its English meaning. */
  | { type: "introduce"; wordIds: string[] }
  /** Hear a Portuguese word and tap the matching picture. */
  | { type: "listen-tap"; wordIds: string[]; choices: 2 | 3 | 4 }
  /** Lua says it, the child says it out loud (no microphone), Lua says it again. */
  | { type: "repeat-with-me"; wordIds: string[] }
  /** Match picture cards to Portuguese audio cards. */
  | { type: "memory-match"; wordIds: string[] };

export type ActivityType = Activity["type"];

export type Unit = {
  id: string;
  treeId: string;
  title: { pt: string; en: string };
  emoji: string;
  /** Sticker the child earns for finishing the unit. */
  sticker: string;
  /** All words taught in this unit (6–10). */
  wordIds: string[];
  activities: Activity[];
};

/** Public URL of a word's audio: its Portuguese form, or its English meaning. */
export const audioPath = (lang: "pt" | "en", id: string) => `/audio/${lang}/${id}.mp3`;

/** Public URL of one of Lua's English instruction lines. */
export const promptAudioPath = (id: string) => `/audio/prompts/${id}.mp3`;
