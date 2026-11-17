import type { Prompt } from "@/lib/types";

/**
 * English lines Lua speaks to guide the child. Short, warm, and always spoken
 * (children aged 3–7 mostly can't read yet).
 */
export const prompts: Prompt[] = [
  { id: "welcome", en: "Hello! I'm Lua the koala. Let's learn Portuguese together!" },
  { id: "who-is-playing", en: "Who's playing? Tap your animal!" },
  { id: "pick-an-animal", en: "Pick an animal friend!" },
  { id: "pick-a-unit", en: "Tap a branch to play!" },
  { id: "listen", en: "Listen!" },
  { id: "listen-and-tap", en: "Listen, then tap the right picture!" },
  { id: "your-turn", en: "Your turn! Say it out loud." },
  { id: "say-it-again", en: "Let's say it again together!" },
  { id: "find-the-pairs", en: "Find the pairs! Tap two cards that go together." },
  { id: "try-again", en: "Oops! Let's listen again." },
  { id: "unit-done", en: "You did it! Here's a sticker for you!" },
  { id: "means", en: "means" },
];
