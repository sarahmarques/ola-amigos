"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

const colours = {
  gum: "bg-gum text-white shadow-[0_8px_0_#2f6249]",
  blossom: "bg-blossom text-ink shadow-[0_8px_0_#c76a82]",
  leaf: "bg-leaf text-ink shadow-[0_8px_0_#4a8a68]",
  wattle: "bg-wattle text-ink shadow-[0_8px_0_#b8901f]",
  white: "bg-white text-ink shadow-[0_8px_0_#94a3b8]",
} as const;

const sizes = {
  md: "min-h-16 min-w-16 px-6 text-2xl",
  lg: "min-h-24 min-w-24 px-8 text-3xl",
} as const;

export type BigButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  colour?: keyof typeof colours;
  size?: keyof typeof sizes;
  children: React.ReactNode;
};

/**
 * Chunky, toy-like button. Minimum 64px tap target (WCAG + small fingers),
 * squishes when pressed.
 */
export function BigButton({
  colour = "gum",
  size = "md",
  className = "",
  disabled,
  children,
  ...rest
}: BigButtonProps) {
  return (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: 0.92, y: 6 }}
      whileHover={disabled ? undefined : { scale: 1.04 }}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-3 rounded-[2rem] font-bold transition-colors
        disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale
        ${colours[colour]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
