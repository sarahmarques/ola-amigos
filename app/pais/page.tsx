"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ParentGate } from "@/components/ui/ParentGate";
import { BigButton } from "@/components/ui/BigButton";
import { WordList } from "@/components/parents/WordList";

export default function ParentArea() {
  const [unlocked, setUnlocked] = useState(false);
  const router = useRouter();

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-6 px-4 py-10">
      {!unlocked ? (
        <ParentGate onUnlock={() => setUnlocked(true)} />
      ) : (
        <div className="flex flex-col gap-6 rounded-3xl bg-white/90 p-6 shadow-xl sm:p-8">
          <h1 className="text-3xl font-bold">Parent area</h1>

          <section>
            <h2 className="mb-1 text-xl font-bold">What your child learns</h2>
            <p className="mb-3 text-slate-600">
              Lua the koala climbs four learning trees. Here are the words in each, with how to say them.
              Progress tracking arrives in a later phase.
            </p>
            <WordList />
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold">Privacy</h2>
            <p className="text-slate-600">
              Olá Amigos teaches European (Portugal) Portuguese. Everything stays on this device: no
              accounts, no analytics, no ads, and no data is sent anywhere.
            </p>
          </section>

          <div className="self-start">
            <BigButton colour="gum" onClick={() => router.push("/")}>← Back to the trees</BigButton>
          </div>
        </div>
      )}
    </main>
  );
}
