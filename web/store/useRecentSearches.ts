"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RecentSearch {
  platform: string;
  gameName: string;
  tagLine: string;
  searchedAt: number;
}

interface State {
  recents: RecentSearch[];
  add: (s: Omit<RecentSearch, "searchedAt">) => void;
  remove: (gameName: string, tagLine: string) => void;
  clear: () => void;
}

export const useRecentSearches = create<State>()(
  persist(
    (set) => ({
      recents: [],
      add: (s) =>
        set((state) => {
          const filtered = state.recents.filter(
            (r) =>
              r.gameName.toLowerCase() !== s.gameName.toLowerCase() ||
              r.tagLine.toLowerCase() !== s.tagLine.toLowerCase()
          );
          return {
            recents: [{ ...s, searchedAt: Date.now() }, ...filtered].slice(0, 8),
          };
        }),
      remove: (gameName, tagLine) =>
        set((state) => ({
          recents: state.recents.filter(
            (r) =>
              r.gameName.toLowerCase() !== gameName.toLowerCase() ||
              r.tagLine.toLowerCase() !== tagLine.toLowerCase()
          ),
        })),
      clear: () => set({ recents: [] }),
    }),
    { name: "lol-tracker-recents" }
  )
);
