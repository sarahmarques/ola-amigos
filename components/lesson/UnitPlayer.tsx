"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { units, trees } from "@/content";
import { preload, setMuted, stopAll, wordClip, promptClip } from "@/lib/audio";
import { isUnitUnlocked } from "@/lib/progress";
import { useActiveProfile, useProgress, useProgressHydrated } from "@/lib/progress-store";
import type { Activity } from "@/lib/types";
import { Mascot, type MascotLine, type MascotMood } from "@/components/ui/Mascot";
import { Introduce } from "@/components/activities/Introduce";
import { ListenTap } from "@/components/activities/ListenTap";
import { RepeatWithMe } from "@/components/activities/RepeatWithMe";
import type { LuaControl } from "@/components/activities/types";
import { StickerReward } from "./StickerReward";

/** Activity types playable so far; the rest (memory-match, …) arrive in Phase 4 and are skipped. */
const SUPPORTED = new Set<Activity["type"]>(["introduce", "listen-tap", "repeat-with-me"]);

function ActivityView({ activity, onDone, lua }: { activity: Activity; onDone: () => void; lua: LuaControl }) {
  switch (activity.type) {
    case "introduce":
      return <Introduce activity={activity} onDone={onDone} lua={lua} />;
    case "listen-tap":
      return <ListenTap activity={activity} onDone={onDone} lua={lua} />;
    case "repeat-with-me":
      return <RepeatWithMe activity={activity} onDone={onDone} lua={lua} />;
    default:
      return null;
  }
}

export function UnitPlayer({ unitId }: { unitId: string }) {
  const router = useRouter();
  const hydrated = useProgressHydrated();
  const profile = useActiveProfile();
  const soundOn = useProgress((s) => s.soundOn);
  const completeUnit = useProgress((s) => s.completeUnit);

  const unit = units.find((u) => u.id === unitId)!;
  const steps = useMemo(() => unit.activities.filter((a) => SUPPORTED.has(a.type)), [unit]);
  const treeHref = `/arvore/${unit.treeId}/`;

  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [run, setRun] = useState(0); // bumps on "play again" to remount activities
  const [line, setLine] = useState<MascotLine>({ pt: unit.title.pt, en: unit.title.en });
  const [mood, setMood] = useState<MascotMood>("idle");

  const lua = useCallback<LuaControl>((l, m = "idle") => {
    setLine(l);
    setMood(m);
  }, []);

  useEffect(() => setMuted(!soundOn), [soundOn]);

  useEffect(() => {
    preload([
      ...unit.wordIds.flatMap((id) => [wordClip(id), wordClip(id, "en")]),
      ...["muito-bem", "boa"].map((id) => wordClip(id)),
      ...["listen-and-tap", "your-turn", "try-again", "unit-done"].map(promptClip),
    ]);
    return stopAll;
  }, [unit]);

  const allowed =
    hydrated &&
    profile !== null &&
    isUnitUnlocked(
      unit.id,
      trees.map((t) => t.id),
      units,
      profile.completed,
    );

  // Send children back if they arrive here without a profile or before unlocking the unit.
  useEffect(() => {
    if (!hydrated) return;
    if (!profile) router.replace("/");
    else if (!allowed) router.replace(treeHref);
  }, [hydrated, profile, allowed, router, treeHref]);

  if (!allowed) return null;

  const next = () => {
    if (step + 1 < steps.length) {
      setStep(step + 1);
    } else {
      completeUnit(unit);
      setFinished(true);
      lua({ pt: "Muito bem!", en: "You did it! Here's a sticker for you!" }, "cheer");
    }
  };

  const playAgain = () => {
    setStep(0);
    setFinished(false);
    setRun((r) => r + 1);
    lua({ pt: unit.title.pt, en: unit.title.en }, "idle");
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center gap-4 px-4 py-4">
      <header className="flex w-full items-center gap-3">
        <button
          type="button"
          onClick={() => router.push(treeHref)}
          aria-label="Back to the tree"
          className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white/80 text-3xl shadow"
        >
          🌳
        </button>
        {/* Progress: one leaf per activity */}
        <ol aria-label={`Step ${Math.min(step + 1, steps.length)} of ${steps.length}`} className="flex flex-1 justify-center gap-2">
          {steps.map((_, i) => (
            <li
              key={i}
              aria-hidden
              className={`text-2xl transition-all sm:text-3xl ${finished || i < step ? "" : i === step ? "scale-125" : "opacity-30 grayscale"}`}
            >
              🍃
            </li>
          ))}
        </ol>
        <span aria-hidden className="w-16 shrink-0 text-center text-4xl">
          {unit.emoji}
        </span>
      </header>

      <Mascot says={line} mood={mood} size={130} />

      {finished ? (
        <StickerReward sticker={unit.sticker} onBackToTree={() => router.push(treeHref)} onPlayAgain={playAgain} />
      ) : (
        <ActivityView key={`${run}-${step}`} activity={steps[step]} onDone={next} lua={lua} />
      )}
    </main>
  );
}
