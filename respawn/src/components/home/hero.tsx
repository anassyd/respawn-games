"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Search, Star } from "lucide-react";
import type { Game } from "@/lib/types";
import { crop, metaColor, year } from "@/lib/utils";
import { SplitText } from "@/components/fx/reveal";
import { Button } from "@/components/ui/button";

/** Full-height hero: rotating "spotlight" game with a cross-fading backdrop, warp-in title and search. */
export function Hero({ spotlight }: { spotlight: Game[] }) {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [q, setQ] = useState("");
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 160]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);
  const game = spotlight[i];

  useEffect(() => {
    if (spotlight.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % spotlight.length), 6000);
    return () => clearInterval(t);
  }, [spotlight.length]);

  return (
    <section className="relative -mt-[72px] flex min-h-[100svh] items-end overflow-hidden pb-16 pt-32">
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <AnimatePresence mode="sync">
          {game?.background_image && (
            <motion.img
              key={game.id}
              src={crop(game.background_image, 1920)!}
              alt=""
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 0.45, scale: 1.02 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.2 }, scale: { duration: 7, ease: "linear" } }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/40 to-transparent" />
      </motion.div>

      {/* orbit rings */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-24 hidden h-[620px] w-[620px] lg:block">
        <div className="absolute inset-0 animate-spin-slow rounded-full border border-ion/20" />
        <div className="absolute inset-16 animate-[spin-slow_45s_linear_infinite_reverse] rounded-full border border-dashed border-plasma/25" />
        <div className="absolute inset-32 rounded-full border border-white/5" />
        <motion.span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-ion shadow-[0_0_16px_hsl(var(--ion))]" />
      </div>

      <motion.div style={{ opacity: fade }} className="container relative">
        <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="label flex items-center gap-3">
          <span className="h-2 w-2 animate-flicker rounded-full bg-ion shadow-[0_0_10px_hsl(var(--ion))]" /> Transmission incoming · 800,000+ games indexed
        </motion.p>
        <h1 className="mt-5 max-w-5xl font-display text-5xl font-bold leading-[0.95] sm:text-7xl lg:text-8xl" style={{ perspective: 600 }}>
          <SplitText text="Find your" delay={0.3} />
          <br />
          <SplitText text="next world" delay={0.65} className="text-glow bg-gradient-to-r from-ion via-star to-plasma bg-clip-text text-transparent" />
        </h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="mt-6 max-w-xl text-lg text-dim">
          Explore the most played games and the characters who made them legends. Rate what you play, rank it in tier lists and track your library.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25 }}
          role="search"
          onSubmit={(e) => { e.preventDefault(); router.push(q.trim() ? `/games?search=${encodeURIComponent(q.trim())}` : "/games"); }}
          className="glass mt-8 flex max-w-xl items-center gap-2 rounded-2xl p-2 focus-within:border-ion/60 focus-within:shadow-[0_0_40px_-10px_hsl(var(--ion))]"
        >
          <Search className="ml-3 h-5 w-5 text-dim" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Elden Ring, Zelda, Halo…" aria-label="Search games" className="h-11 flex-1 bg-transparent text-base outline-none placeholder:text-dim" />
          <Button type="submit">Scan</Button>
        </motion.form>

        {game && (
          <AnimatePresence mode="wait">
            <motion.div
              key={game.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5 }}
              className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              <span className="label">Now trending</span>
              <Link href={`/games/${game.slug}`} className="group flex items-center gap-3">
                <span className="font-display text-2xl font-bold normal-case transition-colors group-hover:text-ion">{game.name}</span>
                <ArrowRight className="h-5 w-5 text-ion transition-transform group-hover:translate-x-1" />
              </Link>
              <span className="flex items-center gap-4 font-mono text-xs text-dim">
                <span>{year(game.released)}</span>
                {game.metacritic && <span style={{ color: metaColor(game.metacritic) }}>MC {game.metacritic}</span>}
                {game.rating > 0 && <span className="flex items-center gap-1 text-solar"><Star className="h-3 w-3 fill-current" />{game.rating.toFixed(1)}</span>}
              </span>
            </motion.div>
          </AnimatePresence>
        )}
        {spotlight.length > 1 && (
          <div className="mt-5 flex gap-2" role="tablist" aria-label="Spotlight games">
            {spotlight.map((g, n) => (
              <button key={g.id} role="tab" aria-selected={n === i} aria-label={g.name} onClick={() => setI(n)} className="relative h-1 w-10 overflow-hidden rounded-full bg-white/15">
                {n === i && <motion.span layoutId="hero-dot" className="absolute inset-0 bg-ion shadow-[0_0_10px_hsl(var(--ion))]" />}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
