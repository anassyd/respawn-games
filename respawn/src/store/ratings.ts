import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameSnap } from "@/store/library";

export type Rating = {
  game: GameSnap;
  overall: number; // 1–10
  story: number;
  gameplay: number;
  graphics: number;
  sound: number;
  review: string;
  updatedAt: string;
};

type RatingsState = {
  ratings: Record<number, Rating>;
  save: (r: Omit<Rating, "updatedAt">) => void;
  remove: (gameId: number) => void;
};

export const useRatings = create<RatingsState>()(
  persist(
    (set) => ({
      ratings: {},
      save: (r) => set((s) => ({ ratings: { ...s.ratings, [r.game.id]: { ...r, updatedAt: new Date().toISOString() } } })),
      remove: (id) => set((s) => { const ratings = { ...s.ratings }; delete ratings[id]; return { ratings }; }),
    }),
    { name: "respawn-ratings" }
  )
);
