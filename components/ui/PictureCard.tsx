"use client";

import { motion, useReducedMotion } from "framer-motion";

export type CardState = "idle" | "correct" | "wrong";

type PictureCardProps = {
  emoji: string;
  /** Accessible name — the English meaning. */
  label: string;
  /** Optional English word written under the picture, for children who can read a little. */
  caption?: string;
  state?: CardState;
  size?: "md" | "lg";
  onTap?: () => void;
  disabled?: boolean;
};

/** A big tappable picture. Wrong answers wobble gently — there is no failing. */
export function PictureCard({ emoji, label, caption, state = "idle", size = "md", onTap, disabled }: PictureCardProps) {
  const reduceMotion = useReducedMotion();
  const animate =
    reduceMotion || state === "idle"
      ? { scale: 1, x: 0 }
      : state === "correct"
        ? { scale: [1, 1.15, 1.05] }
        : { x: [0, -12, 12, -8, 8, 0] };

  const sizing = caption
    ? // Taller than wide, with room for a caption of up to two lines.
      size === "lg"
      ? "h-60 w-48 text-[5.5rem] sm:h-72 sm:w-60 sm:text-[7rem]"
      : "h-44 w-32 text-6xl sm:h-52 sm:w-40 sm:text-7xl"
    : size === "lg"
      ? "aspect-square w-48 text-[6.5rem] sm:w-60 sm:text-[8rem]"
      : "aspect-square w-32 text-7xl sm:w-40 sm:text-8xl";

  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onTap}
      disabled={disabled}
      animate={animate}
      transition={{ duration: 0.45 }}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      className={`flex flex-col items-center justify-center gap-2 rounded-[2rem] border-4 bg-white px-2 shadow-[0_8px_0_rgba(47,98,73,0.2)] transition-colors
        ${sizing}
        ${state === "correct" ? "border-gum bg-mint" : state === "wrong" ? "border-blossom opacity-60" : "border-white"}`}
    >
      <span aria-hidden className="leading-none">
        {emoji}
      </span>
      {caption && (
        <span aria-hidden className="text-center text-lg leading-tight font-bold text-ink sm:text-xl">
          {caption}
        </span>
      )}
    </motion.button>
  );
}
