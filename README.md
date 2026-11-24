# Olá Amigos 🐨

A playful web app that teaches **European (Portugal) Portuguese** to **English-speaking girls aged 3–7**. Lua the koala guides children through short, picture-and-audio lessons — no reading required for the youngest, with English words shown for those who can read a little.

## What's inside

- **Lua the koala** guides every screen, speaking Portuguese and explaining it in English.
- **Four learning trees** Lua climbs, one after another. The first, *Olá!*, has three units:
  - *Olá e adeus* — hello, goodbye, please, thank you, yes, no
  - *O meu nome* — what's your name?, my name is…, I am…
  - *Como estás?* — how are you?, happy, sad, angry, tired, hungry, sleepy
- **Activities:** meet the words, listen and tap the right picture, repeat after Lua (spoken out loud — no microphone), and a memory game matching pictures to Portuguese sounds. More are planned.
- **Stickers** for each finished unit, and units unlock one at a time.
- **Portugal Portuguese only.** Native-sounding pt-PT voices, *tu* forms, and a build check that rejects Brazilian words and grammar.
- **A parent area**, behind a hold-to-open lock, listing every word with its English meaning and how to say it.
- **Private by design.** No accounts, ads or analytics — progress is saved only in the browser.

## Tech

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Motion · Howler.js · Zustand · Vitest. Audio is generated with Azure neural text-to-speech. The site is a fully static export hosted on Netlify.

## Getting started

Requires Node.js 22.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Check the content, then build the static site into `out/` |
| `npm test` | Run the tests |
| `npm run lint` | Lint the code |
| `npm run lint:content` | Check lesson content (pt-PT words, pictures, audio) |
| `npm run audio` | Generate audio for any words that don't have it yet |
| `npm run icons` | Rebuild the favicons from `app/icon.svg` |

## Adding words and audio

Lessons are plain data in `content/`: words in `content/vocab.ts`, units in `content/units/`. After adding a word, generate its audio:

1. Create an Azure Speech resource (the free tier is plenty).
2. Copy `.env.example` to `.env.local` and add your `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION`.
3. Run `npm run audio`.

The build fails if any word is missing its audio. Have a native speaker from Portugal check new Portuguese audio.

## Deployment

Netlify builds the site using `netlify.toml`: it generates any missing audio, then builds and publishes `out/`. To let Netlify generate audio for new words, add `AZURE_SPEECH_KEY` (as a secret) and `AZURE_SPEECH_REGION` under **Site configuration → Environment variables**.
