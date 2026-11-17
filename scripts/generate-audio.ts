/**
 * Generates every audio file the app needs with Azure neural text-to-speech.
 *
 *   npm run audio            # create missing files
 *   npm run audio -- --dry-run   # list what would be created
 *   npm run audio -- --force     # regenerate everything (e.g. after changing voice)
 *
 * Needs AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in .env.local (see .env.example).
 * Portuguese is always spoken by a pt-PT voice; the script refuses anything else,
 * so a Brazilian voice can never slip in.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { audioJobs, type AudioJob } from "./audio-manifest";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const force = args.has("--force");

// Settings can live in .env.local or .env (both are git-ignored). .env.local wins.
for (const file of [".env.local", ".env"]) {
  if (existsSync(file)) process.loadEnvFile(file);
}

const PT_VOICE = process.env.PT_VOICE ?? "pt-PT-RaquelNeural";
const EN_VOICE = process.env.EN_VOICE ?? "en-GB-SoniaNeural";

if (!PT_VOICE.startsWith("pt-PT-")) {
  console.error(`PT_VOICE must be a European Portuguese (pt-PT-…) voice, got "${PT_VOICE}".`);
  process.exit(1);
}
if (!EN_VOICE.startsWith("en-")) {
  console.error(`EN_VOICE must be an English (en-…) voice, got "${EN_VOICE}".`);
  process.exit(1);
}

const escapeXml = (s: string) =>
  s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);

/** Slightly slower speech is easier for young learners to copy. */
function ssml(job: AudioJob): string {
  const voice = job.lang === "pt-PT" ? PT_VOICE : EN_VOICE;
  const locale = voice.split("-").slice(0, 2).join("-");
  const rate = job.lang === "pt-PT" ? "-15%" : "-5%";
  // Strip the trailing ellipsis used in sentence starters ("Chamo-me…").
  const text = escapeXml(job.text.replace(/…$/, ""));
  return `<speak version="1.0" xml:lang="${locale}"><voice name="${voice}"><prosody rate="${rate}">${text}</prosody></voice></speak>`;
}

async function synthesise(job: AudioJob, key: string, region: string): Promise<Buffer> {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent": "ola-amigos-audio-generator",
      },
      body: ssml(job),
    });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    // The free tier allows ~20 requests a minute; wait and retry when throttled.
    if (res.status === 429 && attempt < 6) {
      const waitS = Number(res.headers.get("retry-after")) || 10 * attempt;
      console.log(`  throttled, waiting ${waitS}s…`);
      await new Promise((r) => setTimeout(r, waitS * 1000));
      continue;
    }
    throw new Error(`Azure TTS failed for "${job.text}": ${res.status} ${await res.text()}`);
  }
}

async function main() {
  const jobs = audioJobs();
  const todo = jobs.filter((j) => force || !existsSync(path.join("public", j.publicPath)));

  console.log(`Voices: Portuguese = ${PT_VOICE}, English = ${EN_VOICE}`);
  console.log(`${jobs.length} audio files in total, ${todo.length} to generate.`);
  if (todo.length === 0) return;

  if (dryRun) {
    for (const j of todo) console.log(`  [${j.lang}] ${j.publicPath}  "${j.text}"`);
    return;
  }

  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  if (!key || !region) {
    console.error("Missing AZURE_SPEECH_KEY or AZURE_SPEECH_REGION. Copy .env.example to .env.local (or .env) and fill them in.");
    process.exit(1);
  }

  for (const [i, job] of todo.entries()) {
    const out = path.join("public", job.publicPath);
    mkdirSync(path.dirname(out), { recursive: true });
    writeFileSync(out, await synthesise(job, key, region));
    console.log(`  ${i + 1}/${todo.length} ${job.publicPath}`);
  }
  console.log("Done. Have a native Portugal speaker spot-check the Portuguese files.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
