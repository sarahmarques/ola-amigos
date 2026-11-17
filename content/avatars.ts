/** Animals a child can pick as their profile — each is also a Portuguese word they hear. */
export const avatarWordIds = [
  "o-coala",
  "o-canguru",
  "a-coruja",
  "a-tartaruga",
  "o-papagaio",
  "o-pinguim",
] as const;

export type AvatarId = (typeof avatarWordIds)[number];
