"use client";

import { motion, useReducedMotion } from "framer-motion";

export type CardState = "idle" | "correct" | "wrong";

type PictureCardProps = {
  emoji: string;
  /** Accessible name — the English meaning (never shown, so it can't give the answer away). */
  label: string;
  state?: CardState;
  size?: "md" | "lg";
  onTap?: () => void;
  disabled?: boolean;
};

/** A big tappable picture. Wrong answers wobble gently — there is no failing. */
export function PictureCard({ emoji, label, state = "idle", size = "md", onTap, disabled }: PictureCardProps) {
  const reduceMotion = useReducedMotion();
  const animate =
    reduceMotion || state === "idle"
      ? { scale: 1, x: 0 }
      : state === "correct"
        ? { scale: [1, 1.15, 1.05] }
        : { x: [0, -12, 12, -8, 8, 0] };

  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onTap}
      disabled={disabled}
      animate={animate}
      transition={{ duration: 0.45 }}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      className={`grid aspect-square place-items-center rounded-[2rem] border-4 bg-white shadow-[0_8px_0_rgba(47,98,73,0.2)] transition-colors
        ${size === "lg" ? "w-48 text-[6.5rem] sm:w-60 sm:text-[8rem]" : "w-32 text-7xl sm:w-40 sm:text-8xl"}
        ${state === "correct" ? "border-gum bg-mint" : state === "wrong" ? "border-blossom opacity-60" : "border-white"}`}
    >
      <span aria-hidden>{emoji}</span>
    </motion.button>
  );
}
