import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Game } from "@/lib/types";

export type Shelf = "playing" | "completed" | "backlog" | "wishlist";
export const SHELVES: { value: Shelf; label: string; color: string }[] = [
  { value: "playing", label: "Playing", color: "hsl(var(--ion))" },
  { value: "completed", label: "Completed", color: "#3ee08f" },
  { value: "backlog", label: "Backlog", color: "hsl(var(--solar))" },
  { value: "wishlist", label: "Wishlist", color: "hsl(var(--plasma))" },
];

/** A small copy of the game so the library works without re-fetching. */
export type GameSnap = Pick<Game, "id" | "slug" | "name" | "background_image" | "released" | "metacritic" | "playtime" | "genres">;
export const snap = (g: Game): GameSnap => ({
  id: g.id, slug: g.slug, name: g.name, background_image: g.background_image, released: g.released,
  metacritic: g.metacritic, playtime: g.playtime, genres: g.genres.map(({ id, name, slug }) => ({ id, name, slug })),
});

type Entry = { shelf: Shelf; game: GameSnap; addedAt: string };

type LibraryState = {
  entries: Record<number, Entry>;
  setShelf: (game: GameSnap, shelf: Shelf | null) => void;
};

export const useLibrary = create<LibraryState>()(
  persist(
    (set) => ({
      entries: {},
      setShelf: (game, shelf) =>
        set((s) => {
          const entries = { ...s.entries };
          if (shelf === null) delete entries[game.id];
          else entries[game.id] = { shelf, game, addedAt: entries[game.id]?.addedAt ?? new Date().toISOString() };
          return { entries };
        }),
    }),
    { name: "respawn-library" }
  )
);
