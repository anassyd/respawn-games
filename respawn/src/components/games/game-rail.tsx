"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Game } from "@/lib/types";
import { GameCard } from "@/components/games/game-card";

/** Horizontal, snap-scrolling row of game cards with arrow buttons. */
export function GameRail({ games }: { games: Game[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: "smooth" });
  return (
    <div className="group/rail relative">
      <div ref={ref} className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-5 px-5 py-4">
        {games.map((g, i) => (
          <GameCard key={g.id} game={g} index={i} className="w-[78vw] flex-none snap-start sm:w-[340px]" />
        ))}
      </div>
      {[-1, 1].map((dir) => (
        <button
          key={dir}
          onClick={() => scroll(dir)}
          aria-label={dir < 0 ? "Scroll left" : "Scroll right"}
          className={`glass absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full opacity-0 transition hover:border-ion hover:text-ion group-hover/rail:opacity-100 md:grid ${dir < 0 ? "-left-5" : "-right-5"}`}
        >
          {dir < 0 ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      ))}
    </div>
  );
}
