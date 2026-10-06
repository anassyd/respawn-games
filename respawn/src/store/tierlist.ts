import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TierItem = { id: string; kind: "game" | "character"; name: string; image: string | null };
export const TIERS = [
  { id: "S", color: "#ff4d6d" },
  { id: "A", color: "#ff9f43" },
  { id: "B", color: "#f5d142" },
  { id: "C", color: "#3ee08f" },
  { id: "D", color: "#4cc9f0" },
] as const;
export type TierId = (typeof TIERS)[number]["id"] | "pool";
export type Board = Record<TierId, TierItem[]>;

const empty = (): Board => ({ S: [], A: [], B: [], C: [], D: [], pool: [] });

type TierState = {
  title: string;
  board: Board;
  setTitle: (t: string) => void;
  setBoard: (b: Board) => void;
  add: (item: TierItem) => boolean;
  remove: (id: string) => void;
  reset: () => void;
};

export const useTierList = create<TierState>()(
  persist(
    (set, get) => ({
      title: "My all-time tier list",
      board: empty(),
      setTitle: (title) => set({ title }),
      setBoard: (board) => set({ board }),
      add: (item) => {
        const exists = Object.values(get().board).some((col) => col.some((i) => i.id === item.id));
        if (exists) return false;
        set((s) => ({ board: { ...s.board, pool: [...s.board.pool, item] } }));
        return true;
      },
      remove: (id) =>
        set((s) => ({ board: Object.fromEntries(Object.entries(s.board).map(([k, v]) => [k, v.filter((i) => i.id !== id)])) as Board })),
      reset: () => set({ board: empty() }),
    }),
    { name: "respawn-tierlist" }
  )
);
