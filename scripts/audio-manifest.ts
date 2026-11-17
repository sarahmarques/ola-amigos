import { vocab, prompts } from "../content";
import { audioPath, promptAudioPath } from "../lib/types";

export type AudioJob = {
  /** Path under /public, e.g. /audio/pt/ola.mp3 */
  publicPath: string;
  text: string;
  lang: "pt-PT" | "en";
};

/** Every audio file the app needs, derived from the content. */
export function audioJobs(): AudioJob[] {
  return [
    ...vocab.map((w) => ({ publicPath: audioPath("pt", w.id), text: w.pt, lang: "pt-PT" as const })),
    ...vocab.map((w) => ({ publicPath: audioPath("en", w.id), text: w.en, lang: "en" as const })),
    ...prompts.map((p) => ({ publicPath: promptAudioPath(p.id), text: p.en, lang: "en" as const })),
  ];
}
