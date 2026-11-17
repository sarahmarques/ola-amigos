/**
 * Checks all lesson content before every build:
 *  - no Brazilian Portuguese words or grammar,
 *  - every word has Portuguese, English, a picture and a pronunciation hint,
 *  - units and activities only reference real words,
 *  - audio files exist (a warning by default; an error with --strict).
 *
 *   npm run lint:content
 *   npm run lint:content -- --strict
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { vocab, units, trees, prompts } from "../content";
import { checkContent } from "../lib/content-checks";
import { audioJobs } from "./audio-manifest";

const strict = process.argv.includes("--strict");

const { errors, warnings } = checkContent(
  { vocab, units, treeIds: trees.map((t) => t.id), prompts },
  {
    paths: audioJobs().map((j) => j.publicPath),
    exists: (p) => existsSync(path.join("public", p)),
    required: strict,
  },
);

for (const w of warnings) console.warn(`⚠ ${w}`);
for (const e of errors) console.error(`✖ ${e}`);

console.log(
  `Content: ${vocab.length} words, ${units.length} units, ${prompts.length} prompts — ` +
    `${errors.length} error(s), ${warnings.length} warning(s).`,
);
process.exit(errors.length > 0 ? 1 : 0);
