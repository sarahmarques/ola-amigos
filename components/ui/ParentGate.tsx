"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const HOLD_MS = 3000;
const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type ParentGateProps = {
  onUnlock: () => void;
};

/**
 * Keeps small children out of the parent area: an adult reads the
 * instruction and holds the button for 3 seconds. Releasing early resets it.
 */
export function ParentGate({ onUnlock }: ParentGateProps) {
  const [progress, setProgress] = useState(0); // 0..1
  const startRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    startRef.current = null;
    setProgress(0);
  }, []);

  const tick = useCallback(() => {
    if (startRef.current === null) return;
    const p = Math.min((performance.now() - startRef.current) / HOLD_MS, 1);
    setProgress(p);
    if (p >= 1) {
      frameRef.current = null;
      startRef.current = null;
      onUnlock();
      return;
    }
    frameRef.current = requestAnimationFrame(tick);
  }, [onUnlock]);

  const start = useCallback(() => {
    if (startRef.current !== null) return;
    startRef.current = performance.now();
    frameRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => stop, [stop]);

  const secondsLeft = Math.ceil(((1 - progress) * HOLD_MS) / 1000);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 rounded-3xl bg-white/90 p-8 text-center shadow-xl">
      <h1 className="text-2xl font-bold">Grown-ups only</h1>
      <p className="text-lg text-slate-600">
        Press and hold the button for 3 seconds to open the parent area.
      </p>

      <button
        type="button"
        aria-label="Hold for 3 seconds to open the parent area"
        onPointerDown={start}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onKeyDown={(e) => {
          if ((e.key === " " || e.key === "Enter") && !e.repeat) {
            e.preventDefault();
            start();
          }
        }}
        onKeyUp={stop}
        onContextMenu={(e) => e.preventDefault()}
        className="relative grid h-32 w-32 place-items-center rounded-full bg-slate-100"
      >
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120" aria-hidden>
          <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#e2e8f0" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke="#4a8a68"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          />
        </svg>
        <span className="relative text-3xl font-bold text-gum-deep">
          {progress > 0 ? secondsLeft : "🔒"}
        </span>
      </button>
    </div>
  );
}
