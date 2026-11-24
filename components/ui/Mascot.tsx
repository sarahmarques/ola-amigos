"use client";

import { motion, useReducedMotion } from "motion/react";

export type MascotMood = "idle" | "talking" | "cheer";

/**
 * What Lua says. Learners are English-speaking children, so a bubble can hold
 * a Portuguese word/phrase (the thing being taught, shown big), its English
 * meaning, or a plain English instruction. Audio comes in a later phase.
 */
export type MascotLine = {
  /** Portuguese (pt-PT) — the target language. */
  pt?: string;
  /** English meaning or instruction. */
  en?: string;
};

type MascotProps = {
  says?: MascotLine;
  mood?: MascotMood;
  size?: number;
  className?: string;
};

const FUR = "#a3adb8";
const FUR_LIGHT = "#e6eaee";
const OUTLINE = "#5b6570";
const EAR_PINK = "#f6c6d2";
const NOSE = "#3a4048";

/**
 * Lua the koala (o coala) — the friendly guide who appears on every screen.
 */
export function Mascot({ says, mood = "idle", size = 160, className = "" }: MascotProps) {
  const reduceMotion = useReducedMotion();
  const cheering = mood === "cheer";

  const bodyAnimation = reduceMotion
    ? {}
    : cheering
      ? { y: [0, -24, 0], rotate: [0, -5, 5, 0] }
      : { y: [0, -4, 0], rotate: [0, 1.5, 0, -1.5, 0] };

  const earWiggle = (dir: 1 | -1) =>
    reduceMotion ? {} : { rotate: cheering ? [0, 14 * dir, 0] : [0, 5 * dir, 0] };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {says && (says.pt || says.en) && (
        <motion.div
          key={`${says.pt ?? ""}|${says.en ?? ""}`}
          initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="relative flex flex-col items-center rounded-3xl bg-white px-6 py-3 text-center text-ink shadow-lg"
        >
          {says.pt && (
            <span lang="pt-PT" className="text-3xl font-bold text-gum-deep sm:text-4xl">
              {says.pt}
            </span>
          )}
          {says.en && (
            <span className={says.pt ? "text-lg text-slate-600 sm:text-xl" : "text-2xl font-bold sm:text-3xl"}>
              {says.en}
            </span>
          )}
          <span
            aria-hidden
            className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rotate-45 bg-white"
          />
        </motion.div>
      )}

      <motion.svg
        role="img"
        aria-label="Lua the koala"
        width={size}
        height={size}
        viewBox="0 0 200 200"
        animate={bodyAnimation}
        transition={{
          duration: cheering ? 0.8 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Body */}
        <ellipse cx="100" cy="158" rx="50" ry="38" fill={FUR} stroke={OUTLINE} strokeWidth="3" />
        <ellipse cx="100" cy="166" rx="30" ry="26" fill={FUR_LIGHT} />
        {/* Feet */}
        <ellipse cx="72" cy="192" rx="16" ry="7" fill={FUR} stroke={OUTLINE} strokeWidth="3" />
        <ellipse cx="128" cy="192" rx="16" ry="7" fill={FUR} stroke={OUTLINE} strokeWidth="3" />

        {/* Eucalyptus leaf held in both paws */}
        <path d="M100 178 L100 146" stroke="#8b6b4e" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M100 150 Q80 140 84 120 Q100 128 100 150 Z"
          fill="#7fbf95"
          stroke="#2f6249"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M100 160 Q122 150 120 128 Q102 138 100 160 Z"
          fill="#a8d8b0"
          stroke="#2f6249"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Paws */}
        <ellipse cx="80" cy="160" rx="13" ry="10" fill={FUR} stroke={OUTLINE} strokeWidth="3" />
        <ellipse cx="120" cy="160" rx="13" ry="10" fill={FUR} stroke={OUTLINE} strokeWidth="3" />

        {/* Ears — big and fluffy, they wiggle */}
        <motion.g
          style={{ originX: "62px", originY: "80px" }}
          animate={earWiggle(-1)}
          transition={{ duration: cheering ? 0.4 : 2.2, repeat: Infinity }}
        >
          <circle cx="44" cy="56" r="34" fill={FUR} stroke={OUTLINE} strokeWidth="3" />
          <circle cx="46" cy="58" r="20" fill={EAR_PINK} />
          <circle cx="44" cy="56" r="20" fill="none" stroke={FUR_LIGHT} strokeWidth="5" strokeDasharray="4 5" />
        </motion.g>
        <motion.g
          style={{ originX: "138px", originY: "80px" }}
          animate={earWiggle(1)}
          transition={{ duration: cheering ? 0.4 : 2.2, repeat: Infinity }}
        >
          <circle cx="156" cy="56" r="34" fill={FUR} stroke={OUTLINE} strokeWidth="3" />
          <circle cx="154" cy="58" r="20" fill={EAR_PINK} />
          <circle cx="156" cy="56" r="20" fill="none" stroke={FUR_LIGHT} strokeWidth="5" strokeDasharray="4 5" />
        </motion.g>

        {/* Head */}
        <ellipse cx="100" cy="90" rx="56" ry="50" fill={FUR} stroke={OUTLINE} strokeWidth="3" />
        {/* Cheeks */}
        <circle cx="64" cy="104" r="9" fill="#f6a8bb" opacity="0.7" />
        <circle cx="136" cy="104" r="9" fill="#f6a8bb" opacity="0.7" />
        {/* Eyes */}
        <circle cx="76" cy="82" r="6.5" fill="#26352d" />
        <circle cx="124" cy="82" r="6.5" fill="#26352d" />
        <circle cx="78" cy="80" r="2.2" fill="#ffffff" />
        <circle cx="126" cy="80" r="2.2" fill="#ffffff" />
        {/* Big koala nose */}
        <ellipse cx="100" cy="100" rx="15" ry="19" fill={NOSE} />
        <ellipse cx="95" cy="92" rx="4" ry="6" fill="#ffffff" opacity="0.35" />
        {/* Mouth — opens while talking, big smile when cheering */}
        {cheering ? (
          <path d="M88 124 Q100 138 112 124 Z" fill="#7a3b46" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
        ) : (
          <motion.ellipse
            cx="100"
            cy="127"
            rx="7"
            ry="3"
            fill="#7a3b46"
            style={{ originX: "100px", originY: "125px" }}
            animate={reduceMotion || mood !== "talking" ? {} : { scaleY: [1, 2.4, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
        )}
      </motion.svg>
    </div>
  );
}
