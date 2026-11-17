"use client";

import { BigButton } from "./BigButton";

/** "Hear it again" — always available so children control the pace. */
export function SpeakerButton({ onClick, label = "Hear it again" }: { onClick: () => void; label?: string }) {
  return (
    <BigButton colour="white" onClick={onClick} aria-label={label} className="!min-w-16 !px-4">
      <span aria-hidden className="text-3xl">
        🔊
      </span>
    </BigButton>
  );
}

/** Big round "next" arrow. */
export function NextButton({ onClick, label = "Next" }: { onClick: () => void; label?: string }) {
  return (
    <BigButton colour="gum" size="lg" onClick={onClick} aria-label={label} className="!rounded-full">
      <span aria-hidden className="text-4xl">
        ➜
      </span>
    </BigButton>
  );
}
