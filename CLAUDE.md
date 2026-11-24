# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Olá Amigos: a Next.js 15 (App Router) + TypeScript app teaching **European (Portugal) Portuguese** to **English-speaking girls aged 3–7**. Lua the koala is the guide. English is the language of instruction; Portuguese is the target. Exported as a fully static site (`output: "export"` → `out/`), deployed on Netlify. All progress lives in the browser's localStorage — no backend, no accounts, no analytics.

**The project plan, with what's done and what's next, is in `docs/PLAN.md` when it exists.** It's kept locally and git-ignored, so it won't be in a fresh clone, worktree or cloud session. If it's there, read it before starting new work and update its Status section when a phase or feature lands. If it isn't, carry on without it and don't create one.

## Commands

```bash
npm run dev                     # dev server on :3000 (webpack, not Turbopack)
npm run build                   # runs `lint:content --strict` first (prebuild), then static export to out/
npm run lint                    # ESLint
npx tsc --noEmit                # typecheck
npm test                        # Vitest, all tests
npx vitest run lib/rounds.test.ts            # one test file
npx vitest run -t "unlocks units one at a time"  # one test by name
npm run lint:content            # content checker (missing audio = warning)
npm run lint:content -- --strict             # missing audio = error (what the build uses)
npm run audio                   # generate missing MP3s via Azure TTS; --dry-run lists, --force regenerates all
npm run icons                   # rebuild app/favicon.ico + app/apple-icon.png from app/icon.svg
```

- Don't run `npm run build` while `npm run dev` is running — both use `.next/` and the dev server breaks (restart it to recover). Don't "fix" this with a custom `distDir`: it moves the static export out of `out/`, which Netlify publishes.
- Turbopack is off on purpose: it hit Windows path-length limits.

## Architecture

**Content is typed data; components are generic.** `lib/types.ts` defines `Word`, `Unit`, `Prompt` and `Activity` (a discriminated union on `type`). Lessons are added by editing `content/` only:

- `content/vocab.ts` — word bank. `id` is kebab-case and doubles as the audio file name. Each word has `pt`, `en`, `emoji` (the picture), `hint` (pronunciation for English-speaking parents).
- `content/units/*.ts` — units reference word ids; `content/index.ts` aggregates them (`units`, `unitsForTree`).
- `content/trees.ts` — the 4 learning "trees" (curriculum stages) Lua climbs. Trees 2–4 have no units yet.
- `content/prompts.ts` — Lua's spoken English instructions. `content/avatars.ts` — profile animals (also vocab words).

**Content checker** (`lib/content-checks.ts`, run by `scripts/lint-content.ts` before every build) enforces pt-PT and data integrity: blocks Brazilian-only words (`você`, `ônibus`, `suco`, `oi`, `bebê`…), the Brazilian gerund (`estou comendo` → must be `estou a comer`) and sentence-initial clitics (`Me chamo` → `Chamo-me`); checks references, that every unit word is introduced, that listen-tap/memory-match words have distinct emoji (children answer by picture), and that audio exists.

**Audio pipeline.** `scripts/audio-manifest.ts` derives every needed file from content: `/audio/pt/{id}.mp3` (pt-PT voice), `/audio/en/{id}.mp3` (English meaning), `/audio/prompts/{id}.mp3`. `scripts/generate-audio.ts` calls the Azure TTS REST API, only creates missing files, refuses non-`pt-PT-` voices. Generated MP3s are committed in `public/audio/`. Credentials: env vars `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION` (optional `PT_VOICE`, `EN_VOICE`) — real env first, then `.env.local`, then `.env`. Only this script reads them; never expose them via `NEXT_PUBLIC_`.

**Playback** (`lib/audio.ts`): `playSequence(clips)` plays clips in order and resolves `false` if interrupted (each new play or `stopAll()` bumps a generation counter). Uses Howler; HEAD-checks each file first and, if missing, falls back to browser speech — but for Portuguese only with a `pt-PT` voice, otherwise silent (never a Brazilian accent).

**Lesson flow.** Routes: `/` (profile picker → tree map), `/arvore/[tree]/` (`components/tree/TreeView.tsx`), `/unidade/[unit]/` (`components/lesson/UnitPlayer.tsx`), `/pais/` (parent area behind a hold-3-seconds `ParentGate`). Dynamic routes use `generateStaticParams` + `dynamicParams = false` for the static export. `UnitPlayer` runs a unit's activities in order and maps `activity.type` → component in `components/activities/`; types not in its `SUPPORTED` set are skipped (currently `memory-match`, planned with drag-drop, songs, stories, letter tracing). Activities get `{ activity, onDone, lua }` — `lua(line, mood)` drives the mascot's speech bubble (`{ pt, en }`) and must stay referentially stable (it's in effect deps).

**Progress.** Unlock rules are pure functions in `lib/progress.ts` (trees unlock in order once the previous tree's units are all done; units unlock one at a time; finished units stay playable). `lib/progress-store.ts` is a Zustand store persisted to localStorage (key `ola-amigos-progress`) holding profiles (animal avatar, completed units, stickers, words learned). Pages render nothing until `useProgressHydrated()` is true and redirect if the profile/unit isn't allowed.

## Content conventions

- European Portuguese only: address the child with **tu**, `estar a` + infinitive, pronouns after the verb (`Chamo-me`), pt-PT vocabulary (`autocarro`, `sumo`, `pequeno-almoço`).
- The app is aimed at girls: use girl pictures and feminine forms where a word changes (`zangada`, `cansada`, `obrigada`). Boy-form words exist in vocab but are deliberately not used in units.
- After adding or changing a word, run `npm run audio` (or let the Netlify build do it) — the build fails on missing audio. Native Portugal speakers should spot-check new Portuguese audio.
- UI text is English (`<html lang="en">`); mark Portuguese text with `lang="pt-PT"`.

## Repo conventions

- Netlify build command is `npm run audio && npm run build` (`netlify.toml`), Node 22.

