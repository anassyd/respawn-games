"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star } from "lucide-react";
import type { Game } from "@/lib/types";
import { cn, crop, metaColor, year } from "@/lib/utils";
import { PlatformIcons } from "@/components/games/platform-icons";
import { ShelfMenu } from "@/components/games/shelf-menu";

/** 3D tilt card with a moving glare, screenshot cycling on hover and HUD corners. */
export function GameCard({ game, index = 0, className }: { game: Game; index?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5), my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 200, damping: 18 });
  const glare = useTransform([mx, my], ([x, y]: number[]) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,.18), transparent 55%)`);
  const [hover, setHover] = useState(false);
  const [shot, setShot] = useState(0);
  const shots = (game.short_screenshots ?? []).slice(1, 5).map((s) => s.image);
  const images = [game.background_image, ...shots].filter(Boolean) as string[];

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    mx.set(px);
    my.set((e.clientY - r.top) / r.height);
    // scrub through screenshots by moving across the card
    if (images.length > 1) setShot(Math.min(images.length - 1, Math.floor(px * images.length)));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 900 }}
      className={cn("group", className)}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => { setHover(false); setShot(0); mx.set(0.5); my.set(0.5); }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="hud glass relative overflow-hidden rounded-2xl transition-shadow duration-300 hover:shadow-[0_20px_60px_-20px_hsl(var(--ion)/0.5)]"
      >
        <Link href={`/games/${game.slug}`} className="block">
          <div className="relative aspect-[16/10] overflow-hidden bg-deep">
            <AnimatePresence initial={false}>
              {images[shot] && (
                <motion.img
                  key={images[shot]}
                  src={crop(images[shot], 640)!}
                  alt={shot === 0 ? game.name : ""}
                  loading="lazy"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, scale: hover ? 1.07 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
            {images.length > 1 && hover && (
              <div className="absolute inset-x-3 top-3 flex gap-1">
                {images.map((_, i) => <span key={i} className={cn("h-0.5 flex-1 rounded-full transition-colors", i === shot ? "bg-ion" : "bg-white/25")} />)}
              </div>
            )}
            {game.metacritic && (
              <span className="absolute right-3 top-4 rounded-md border px-1.5 py-0.5 font-mono text-xs font-bold backdrop-blur" style={{ color: metaColor(game.metacritic), borderColor: metaColor(game.metacritic) }}>
                {game.metacritic}
              </span>
            )}
          </div>
          <div className="relative -mt-10 space-y-2 p-4" style={{ transform: "translateZ(30px)" }}>
            <PlatformIcons platforms={game.parent_platforms} />
            <h3 className="line-clamp-1 font-display text-lg font-bold normal-case tracking-normal transition-colors group-hover:text-ion">{game.name}</h3>
            <div className="flex items-center justify-between font-mono text-xs text-dim">
              <span>{year(game.released)} · {game.genres.slice(0, 2).map((g) => g.name).join(", ") || "Game"}</span>
              {game.rating > 0 && <span className="flex items-center gap-1 text-solar"><Star className="h-3 w-3 fill-current" />{game.rating.toFixed(1)}</span>}
            </div>
          </div>
        </Link>
        <motion.div className="pointer-events-none absolute inset-0" style={{ background: glare, opacity: hover ? 1 : 0 }} />
        <div className="absolute left-3 top-6 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100" style={{ transform: "translateZ(40px)" }}>
          <ShelfMenu game={game} compact />
        </div>
      </motion.div>
    </motion.div>
  );
}
