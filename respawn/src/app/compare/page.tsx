"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Crown, Swords, X } from "lucide-react";
import type { Game, GameDetail } from "@/lib/types";
import { rawgClient } from "@/lib/rawg";
import { crop, cn, year } from "@/lib/utils";
import { GamePicker } from "@/components/games/game-picker";
import { SplitText } from "@/components/fx/reveal";
import { Button } from "@/components/ui/button";

type Side = 0 | 1;
const STATS: { key: string; label: string; get: (g: GameDetail) => number; fmt: (v: number) => string; max: (a: number, b: number) => number }[] = [
  { key: "mc", label: "Metacritic", get: (g) => g.metacritic ?? 0, fmt: (v) => (v ? String(v) : "—"), max: () => 100 },
  { key: "rating", label: "Player rating", get: (g) => g.rating, fmt: (v) => v.toFixed(2), max: () => 5 },
  { key: "votes", label: "Player votes", get: (g) => g.ratings_count, fmt: (v) => v.toLocaleString(), max: (a, b) => Math.max(a, b, 1) },
  { key: "added", label: "Libraries", get: (g) => g.added ?? 0, fmt: (v) => v.toLocaleString(), max: (a, b) => Math.max(a, b, 1) },
  { key: "play", label: "Avg. playtime (h)", get: (g) => g.playtime, fmt: (v) => String(v), max: (a, b) => Math.max(a, b, 1) },
  { key: "exc", label: "“Exceptional” votes %", get: (g) => g.ratings.find((r) => r.title === "exceptional")?.percent ?? 0, fmt: (v) => `${v.toFixed(0)}%`, max: () => 100 },
];

function useDetail(slug: string | null) {
  return useQuery({ queryKey: ["game", slug], queryFn: () => rawgClient<GameDetail>(`/games/${slug}`), enabled: !!slug });
}

export default function ComparePage() {
  const [picks, setPicks] = useState<[Game | null, Game | null]>([null, null]);
  const [vote, setVote] = useState<Side | null>(null);
  const a = useDetail(picks[0]?.slug ?? null);
  const b = useDetail(picks[1]?.slug ?? null);
  const ready = a.data && b.data;

  const set = (side: Side, g: Game | null) => { setPicks((p) => (side === 0 ? [g, p[1]] : [p[0], g])); setVote(null); };

  // Each stat won counts as a point.
  const score = ready ? STATS.reduce((acc, s) => { const va = s.get(a.data!), vb = s.get(b.data!); if (va > vb) acc[0]++; else if (vb > va) acc[1]++; return acc; }, [0, 0]) : [0, 0];
  const leader = score[0] === score[1] ? null : score[0] > score[1] ? 0 : 1;

  return (
    <div className="container py-14">
      <p className="label">Versus mode</p>
      <h1 className="mt-3 text-5xl font-bold sm:text-7xl" style={{ perspective: 600 }}><SplitText text="Head to" /> <SplitText text="head" delay={0.2} className="text-glow text-plasma" /></h1>

      <div className="relative mt-10 grid gap-6 lg:grid-cols-2">
        {[0, 1].map((side) => {
          const g = picks[side as Side];
          return (
            <div key={side} className={cn("glass hud relative min-h-[260px] overflow-hidden rounded-3xl p-5", side === 0 ? "border-ion/30" : "border-plasma/30")}>
              {g ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {g.background_image && <motion.img initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 0.35, scale: 1 }} src={crop(g.background_image, 900)!} alt="" className="absolute inset-0 h-full w-full object-cover" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-void to-void/30" />
                  <div className="relative flex h-full min-h-[220px] flex-col justify-end">
                    <button onClick={() => set(side as Side, null)} aria-label="Change game" className="absolute right-0 top-0 grid h-9 w-9 place-items-center rounded-full bg-void/70 hover:text-ion"><X className="h-4 w-4" /></button>
                    <p className="label" style={{ color: side === 0 ? "hsl(var(--ion))" : "hsl(var(--plasma))" }}>Player {side + 1}</p>
                    <Link href={`/games/${g.slug}`} className="mt-1 font-display text-3xl font-bold hover:underline">{g.name}</Link>
                    <p className="font-mono text-xs text-dim">{year(g.released)} · {g.genres.map((x) => x.name).slice(0, 2).join(", ")}</p>
                    {ready && leader === side && <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-md bg-solar px-2 py-1 font-display text-xs font-bold uppercase text-void"><Crown className="h-3.5 w-3.5" /> Wins on stats {score[side]}–{score[1 - side]}</motion.span>}
                  </div>
                </>
              ) : (
                <div className="flex h-full min-h-[220px] flex-col justify-center">
                  <p className="label mb-3" style={{ color: side === 0 ? "hsl(var(--ion))" : "hsl(var(--plasma))" }}>Player {side + 1} · select a game</p>
                  <GamePicker onPick={(x) => set(side as Side, x)} placeholder={side === 0 ? "e.g. The Witcher 3" : "e.g. Elden Ring"} />
                </div>
              )}
            </div>
          );
        })}
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 hidden h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-void font-display text-xl font-bold shadow-[0_0_40px_-6px_hsl(var(--plasma))] lg:grid">VS</div>
      </div>

      <AnimatePresence>
        {ready && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass mt-8 rounded-3xl p-6 sm:p-8">
            <div className="space-y-6">
              {STATS.map((s, i) => {
                const va = s.get(a.data!), vb = s.get(b.data!);
                const max = s.max(va, vb);
                return (
                  <div key={s.key}>
                    <p className="label mb-2 text-center">{s.label}</p>
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      <div className="flex justify-end">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(va / max) * 100}%` }} transition={{ delay: i * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          className={cn("h-3 rounded-l-full bg-ion", va >= vb ? "shadow-[0_0_16px_hsl(var(--ion))]" : "opacity-40")} />
                      </div>
                      <span className="w-40 text-center font-mono text-sm"><span className={va > vb ? "text-ion" : "text-dim"}>{s.fmt(va)}</span><span className="mx-2 text-dim">/</span><span className={vb > va ? "text-plasma" : "text-dim"}>{s.fmt(vb)}</span></span>
                      <div>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(vb / max) * 100}%` }} transition={{ delay: i * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          className={cn("h-3 rounded-r-full bg-plasma", vb >= va ? "shadow-[0_0_16px_hsl(var(--plasma))]" : "opacity-40")} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 border-t border-white/10 pt-8 text-center">
              <p className="label">Your call</p>
              <h2 className="mt-2 text-2xl font-bold">Which one would you play tonight?</h2>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button onClick={() => setVote(0)} className={cn(vote === 1 && "opacity-40")}><Swords /> {picks[0]!.name}</Button>
                <Button variant="plasma" onClick={() => setVote(1)} className={cn(vote === 0 && "opacity-40")}><Swords /> {picks[1]!.name}</Button>
              </div>
              <AnimatePresence>
                {vote !== null && (
                  <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 font-display text-3xl font-bold uppercase" style={{ color: vote === 0 ? "hsl(var(--ion))" : "hsl(var(--plasma))" }}>
                    {picks[vote]!.name} takes the crown
                    {leader !== null && leader !== vote && <span className="mt-1 block font-sans text-sm normal-case text-dim">Even though the stats favour {picks[leader]!.name}. Taste beats numbers.</span>}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
