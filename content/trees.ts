export type LearningTree = {
  id: string;
  /** Portuguese name shown to the child (pt-PT). */
  name: string;
  /** English meaning — learners are English-speaking children. */
  en: string;
  emoji: string;
  colour: string;
  minAge: number;
};

/**
 * The four learning trees Lua the koala climbs, one after another
 * (the curriculum's four stages). Units come in Phase 2/3.
 */
export const trees: LearningTree[] = [
  { id: "ola", name: "Olá!", en: "Hello!", emoji: "👋", colour: "#f6a8bb", minAge: 3 },
  { id: "o-meu-mundo", name: "O meu mundo", en: "My world", emoji: "🎨", colour: "#f7c948", minAge: 3 },
  { id: "a-volta", name: "À volta", en: "All around", emoji: "🐾", colour: "#a8d8b0", minAge: 4 },
  { id: "vamos-falar", name: "Vamos falar", en: "Let's talk", emoji: "💬", colour: "#cdb9e8", minAge: 5 },
];
