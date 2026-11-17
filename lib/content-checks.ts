import type { Prompt, Unit, Word } from "./types";

/**
 * Brazilian-only words and the European Portuguese word to use instead.
 * Only words that are unambiguous in Portugal are listed, to avoid false alarms.
 */
export const BRAZILIAN_WORDS: Record<string, string> = {
  // ("vocês" for "you all" is normal in Portugal, so it's not listed.)
  "você": "tu (talking to a child) or the person's name",
  "ônibus": "autocarro",
  "onibus": "autocarro",
  "trem": "comboio",
  "suco": "sumo",
  "celular": "telemóvel",
  "sorvete": "gelado",
  "geladeira": "frigorífico",
  "banheiro": "casa de banho",
  "xícara": "chávena",
  "café da manhã": "pequeno-almoço",
  "moça": "rapariga / menina",
  "oi": "olá",
  "tchau": "adeus",
  "bebê": "bebé",
  "nenê": "bebé",
  "esporte": "desporto",
  "cardápio": "ementa",
  "time": "equipa",
};

const L = "\\p{L}";
const wordRegex = (w: string) => new RegExp(`(?<!${L})${w.replace(/ /g, "\\s+")}(?!${L})`, "iu");

const GERUND_PROGRESSIVE = new RegExp(
  `(?<!${L})(estou|estás|está|estamos|estão|estava|estavam)\\s+${L}+ndo(?!${L})`,
  "iu",
);
/** Sentence starting with a clitic pronoun ("Me chamo…") — Brazilian word order. */
const LEADING_CLITIC = new RegExp(`(^|[.!?¿¡…]\\s*)(me|te|se|lhe|nos)\\s+${L}+`, "iu");

/** Returns a reason for every Brazilian-Portuguese feature found in `text`. */
export function findBrazilianisms(text: string): string[] {
  const found: string[] = [];
  for (const [br, pt] of Object.entries(BRAZILIAN_WORDS)) {
    if (wordRegex(br).test(text)) found.push(`"${br}" is Brazilian; use ${pt}`);
  }
  const gerund = text.match(GERUND_PROGRESSIVE);
  if (gerund) found.push(`"${gerund[0]}" uses the Brazilian gerund; use estar a + infinitive (e.g. "estou a comer")`);
  const clitic = text.match(LEADING_CLITIC);
  if (clitic) found.push(`"${clitic[0].trim()}" puts the pronoun first; in Portugal it goes after the verb (e.g. "Chamo-me")`);
  return found;
}

export type ContentInput = {
  vocab: Word[];
  units: Unit[];
  treeIds: string[];
  prompts: Prompt[];
};

export type AudioCheck = {
  /** Every public audio path the content needs. */
  paths: string[];
  exists: (publicPath: string) => boolean;
  /** Missing audio is an error when true, a warning otherwise. */
  required: boolean;
};

export type CheckResult = { errors: string[]; warnings: string[] };

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function checkContent({ vocab, units, treeIds, prompts }: ContentInput, audio?: AudioCheck): CheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Words
  const wordIds = new Set<string>();
  for (const w of vocab) {
    const where = `word "${w.id}"`;
    if (wordIds.has(w.id)) errors.push(`${where}: duplicate id`);
    wordIds.add(w.id);
    if (!KEBAB.test(w.id)) errors.push(`${where}: id must be kebab-case (it becomes the audio file name)`);
    for (const field of ["pt", "en", "emoji", "hint"] as const) {
      if (!w[field]?.trim()) errors.push(`${where}: missing ${field}`);
    }
    for (const reason of findBrazilianisms(w.pt)) errors.push(`${where}: ${reason}`);
  }

  // Units
  const unitIds = new Set<string>();
  const trees = new Set(treeIds);
  for (const u of units) {
    const where = `unit "${u.id}"`;
    if (unitIds.has(u.id)) errors.push(`${where}: duplicate id`);
    unitIds.add(u.id);
    if (!trees.has(u.treeId)) errors.push(`${where}: unknown tree "${u.treeId}"`);
    for (const reason of findBrazilianisms(u.title.pt)) errors.push(`${where} title: ${reason}`);
    if (u.wordIds.length < 3 || u.wordIds.length > 12) {
      warnings.push(`${where}: has ${u.wordIds.length} words (aim for 6–10)`);
    }
    for (const id of u.wordIds) {
      if (!wordIds.has(id)) errors.push(`${where}: unknown word "${id}"`);
    }
    if (u.activities.length === 0) errors.push(`${where}: has no activities`);
    if (!u.sticker?.trim()) errors.push(`${where}: missing sticker`);

    const inUnit = new Set(u.wordIds);
    u.activities.forEach((a, i) => {
      const at = `${where} activity ${i + 1} (${a.type})`;
      for (const id of a.wordIds) {
        if (!inUnit.has(id)) errors.push(`${at}: word "${id}" is not in the unit's wordIds`);
      }
      if (a.type === "listen-tap" && a.wordIds.length < a.choices) {
        errors.push(`${at}: needs at least ${a.choices} words to offer ${a.choices} choices`);
      }
      if (a.type === "listen-tap" || a.type === "memory-match") {
        // Children answer by picture, so two words can't share one.
        const seen = new Map<string, string>();
        for (const id of a.wordIds) {
          const emoji = vocab.find((w) => w.id === id)?.emoji;
          if (!emoji) continue;
          const other = seen.get(emoji);
          if (other) errors.push(`${at}: "${other}" and "${id}" share the picture ${emoji}`);
          else seen.set(emoji, id);
        }
      }
      if (a.type === "memory-match" && a.wordIds.length < 2) {
        errors.push(`${at}: needs at least 2 words`);
      }
    });
    // Every word in a unit should be introduced before it's tested.
    const introduced = new Set(u.activities.filter((a) => a.type === "introduce").flatMap((a) => a.wordIds));
    for (const id of u.wordIds) {
      if (!introduced.has(id)) warnings.push(`${where}: word "${id}" is never introduced`);
    }
  }

  // Prompts
  const promptIds = new Set<string>();
  for (const p of prompts) {
    if (promptIds.has(p.id)) errors.push(`prompt "${p.id}": duplicate id`);
    promptIds.add(p.id);
    if (!p.en.trim()) errors.push(`prompt "${p.id}": empty`);
  }

  // Audio
  if (audio) {
    const missing = audio.paths.filter((p) => !audio.exists(p));
    if (missing.length > 0) {
      const msg = `${missing.length} of ${audio.paths.length} audio files missing (run \`npm run audio\`), e.g. ${missing.slice(0, 3).join(", ")}`;
      (audio.required ? errors : warnings).push(msg);
    }
  }

  return { errors, warnings };
}
