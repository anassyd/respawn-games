"use client";

import { LayoutList, Star } from "lucide-react";
import { toast } from "sonner";
import type { Game } from "@/lib/types";
import { useRatings } from "@/store/ratings";
import { useTierList } from "@/store/tierlist";
import { useMounted } from "@/lib/use-mounted";
import { ShelfMenu } from "@/components/games/shelf-menu";
import { Button } from "@/components/ui/button";

export function GameActions({ game }: { game: Game }) {
  const mounted = useMounted();
  const mine = useRatings((s) => s.ratings[game.id]);
  const add = useTierList((s) => s.add);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ShelfMenu game={game} />
      <Button variant="outline" onClick={() => document.getElementById("rate")?.scrollIntoView({ behavior: "smooth" })}>
        <Star className={mounted && mine ? "fill-solar text-solar" : ""} />
        {mounted && mine ? `You rated ${mine.overall}/10` : "Rate it"}
      </Button>
      <Button
        variant="ghost"
        onClick={() => {
          const ok = add({ id: `g-${game.id}`, kind: "game", name: game.name, image: game.background_image });
          toast(ok ? `${game.name} added to your tier list` : "Already on your tier list");
        }}
      >
        <LayoutList /> Add to tier list
      </Button>
    </div>
  );
}
