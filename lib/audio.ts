"use client";

import { Howl } from "howler";
import { getWord, prompts } from "@/content";
import { audioPath, promptAudioPath } from "./types";

/** One thing to say: a pre-generated MP3, plus the text as a fallback. */
export type Clip = { src: string; text: string; lang: "pt-PT" | "en" };

export const wordClip = (id: string, lang: "pt" | "en" = "pt"): Clip => {
  const w = getWord(id);
  return lang === "pt"
    ? { src: audioPath("pt", id), text: w.pt, lang: "pt-PT" }
    : { src: audioPath("en", id), text: w.en, lang: "en" };
};

export const promptClip = (id: string): Clip => {
  const p = prompts.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown prompt id: ${id}`);
  return { src: promptAudioPath(id), text: p.en, lang: "en" };
};

let muted = false;
export function setMuted(value: boolean) {
  muted = value;
  if (value) stopAll();
}

const howls = new Map<string, Howl>();
const available = new Map<string, Promise<boolean>>();

/** Checks once per file whether the MP3 exists (it won't until `npm run audio` has run). */
function hasFile(src: string): Promise<boolean> {
  let p = available.get(src);
  if (!p) {
    p = fetch(src, { method: "HEAD" })
      .then((r) => r.ok)
      .catch(() => false);
    available.set(src, p);
  }
  return p;
}

function howlFor(src: string): Howl {
  let h = howls.get(src);
  if (!h) {
    h = new Howl({ src: [src], preload: true });
    howls.set(src, h);
  }
  return h;
}

/** Start loading a unit's audio so it plays instantly. */
export function preload(clips: Clip[]) {
  for (const c of clips) {
    hasFile(c.src).then((ok) => ok && howlFor(c.src));
  }
}

let generation = 0;
let current: Howl | null = null;

/** Stop whatever is playing and cancel any queued sequence. */
export function stopAll() {
  generation++;
  current?.stop();
  current = null;
  if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
}

/**
 * Play clips one after another. Resolves `true` when all played,
 * `false` if interrupted by another play or stopAll().
 */
export async function playSequence(clips: Clip[]): Promise<boolean> {
  stopAll();
  const mine = generation;
  for (const clip of clips) {
    if (mine !== generation) return false;
    await playOne(clip);
  }
  return mine === generation;
}

export const play = (clip: Clip) => playSequence([clip]);

async function playOne(clip: Clip): Promise<void> {
  if (muted) return;
  if (!(await hasFile(clip.src))) return speakFallback(clip);

  const howl = howlFor(clip.src);
  current = howl;
  return new Promise<void>((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      howl.off("end", finish);
      howl.off("stop", finish);
      howl.off("loaderror", fail);
      howl.off("playerror", fail);
      clearTimeout(safety);
      resolve();
    };
    const fail = () => {
      howls.delete(clip.src);
      available.set(clip.src, Promise.resolve(false));
      speakFallback(clip).then(finish);
    };
    // Never leave a child waiting if something goes wrong.
    const safety = setTimeout(finish, 15000);
    howl.once("end", finish);
    howl.once("stop", finish);
    howl.once("loaderror", fail);
    howl.once("playerror", fail);
    howl.play();
  });
}

let warnedNoPtVoice = false;

/**
 * Development fallback until the MP3s are generated: the browser's own voice.
 * Portuguese only ever uses a pt-PT voice — if the device has none, it stays
 * silent rather than speak with a Brazilian accent.
 */
async function speakFallback(clip: Clip): Promise<void> {
  if (typeof speechSynthesis === "undefined") return;
  const voices = await loadVoices();
  const norm = (l: string) => l.toLowerCase().replace("_", "-");
  const voice =
    clip.lang === "pt-PT"
      ? voices.find((v) => norm(v.lang) === "pt-pt")
      : (voices.find((v) => norm(v.lang) === "en-gb") ?? voices.find((v) => norm(v.lang).startsWith("en")));

  if (!voice) {
    if (clip.lang === "pt-PT" && !warnedNoPtVoice) {
      warnedNoPtVoice = true;
      console.warn("No pt-PT voice on this device and no MP3 yet — run `npm run audio`.");
    }
    return new Promise((r) => setTimeout(r, 600));
  }

  return new Promise<void>((resolve) => {
    const u = new SpeechSynthesisUtterance(clip.text.replace(/…$/, ""));
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = clip.lang === "pt-PT" ? 0.8 : 0.95;
    const safety = setTimeout(resolve, 8000);
    u.onend = u.onerror = () => {
      clearTimeout(safety);
      resolve();
    };
    speechSynthesis.speak(u);
  });
}

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  const now = speechSynthesis.getVoices();
  if (now.length > 0) return Promise.resolve(now);
  return new Promise((resolve) => {
    const done = () => resolve(speechSynthesis.getVoices());
    speechSynthesis.addEventListener("voiceschanged", done, { once: true });
    setTimeout(done, 1000);
  });
}
