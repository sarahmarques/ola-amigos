"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AvatarId } from "@/content/avatars";
import type { Completed } from "./progress";
import type { Unit } from "./types";

export const MAX_PROFILES = 6;

export type Profile = {
  id: string;
  avatar: AvatarId;
  completed: Completed;
  stickers: string[];
  /** Word ids from finished units, for the parent area. */
  wordsLearned: string[];
};

type ProgressState = {
  profiles: Profile[];
  activeId: string | null;
  soundOn: boolean;
  addProfile: (avatar: AvatarId) => string | null;
  selectProfile: (id: string | null) => void;
  completeUnit: (unit: Unit) => void;
  setSoundOn: (on: boolean) => void;
};

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/**
 * All progress lives in this browser's localStorage — nothing leaves the device.
 * If storage is blocked (private mode) the app still works; progress just isn't kept.
 */
export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeId: null,
      soundOn: true,

      addProfile: (avatar) => {
        if (get().profiles.length >= MAX_PROFILES) return null;
        const profile: Profile = { id: newId(), avatar, completed: {}, stickers: [], wordsLearned: [] };
        set((s) => ({ profiles: [...s.profiles, profile], activeId: profile.id }));
        return profile.id;
      },

      selectProfile: (id) => set({ activeId: id }),

      completeUnit: (unit) =>
        set((s) => ({
          profiles: s.profiles.map((p) =>
            p.id !== s.activeId
              ? p
              : {
                  ...p,
                  completed: { ...p.completed, [unit.id]: { completedAt: Date.now() } },
                  stickers: p.stickers.includes(unit.sticker) ? p.stickers : [...p.stickers, unit.sticker],
                  wordsLearned: [...new Set([...p.wordsLearned, ...unit.wordIds])],
                },
          ),
        })),

      setSoundOn: (on) => set({ soundOn: on }),
    }),
    {
      name: "ola-amigos-progress",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ profiles, activeId, soundOn }) => ({ profiles, activeId, soundOn }),
    },
  ),
);

export function useActiveProfile(): Profile | null {
  return useProgress((s) => s.profiles.find((p) => p.id === s.activeId) ?? null);
}

/** True once saved progress has loaded — avoids flashing the wrong screen. */
export function useProgressHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const unsubscribe = useProgress.persist.onFinishHydration(() => setHydrated(true));
    if (useProgress.persist.hasHydrated()) setHydrated(true);
    return unsubscribe;
  }, []);
  return hydrated;
}
