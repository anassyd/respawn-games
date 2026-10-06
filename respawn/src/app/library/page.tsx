"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Gamepad2, Star, Trophy } from "lucide-react";
import { SHELVES, useLibrary, type Shelf } from "@/store/library";
import { useRatings } from "@/store/ratings";
import { useMounted } from "@/lib/use-mounted";
import { cn, crop, metaColor, year } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SplitText } from "@/components/fx/reveal";

export default function LibraryPage() {
  const mounted = useMounted();
  const entries = useLibrary((s) => s.entries);
  const setShelf = useLibrary((s) => s.setShelf);
  const ratings = useRatings((s) => s.ratings);
  const [tab, setTab] = useState<Shelf | "rated">("playing");

  if (!mounted) return <div className="container py-14" />;

  const list = Object.values(entries).sort((a, b) => b.addedAt.localeCompare(a.addedAt));
  const rated = Object.values(ratings).sort((a, b) => b.overall - a.overall);
  const shown = tab === "rated" ? [] : list.filter((e) => e.shelf === tab);

  // stats
  const completed = list.filter((e) => e.shelf === "completed");
  const backlogHours = list.filter((e) => e.shelf === "backlog").reduce((n, e) => n + (e.game.playtime || 0), 0);
  const avg = rated.length ? rated.reduce((n, r) => n + r.overall, 0) / rated.length : 0;
  const genreCount = new Map<string, number>();
  [...list.map((e) => e.game), ...rated.map((r) => r.game)].forEach((g) => g.genres.forEach((x) => genreCount.set(x.name, (genreCount.get(x.name) ?? 0) + 1)));
  const topGenre = [...genreCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  const stats = [
    { icon: Gamepad2, label: "In library", value: list.length },
    { icon: Trophy, label: "Completed", value: completed.length },
    { icon: Clock, label: "Backlog hours", value: backlogHours },
    { icon: Star, label: "Avg. your score", value: avg ? avg.toFixed(1) : "—" },
  ];

  return (
    <div className="container py-14">
      <p className="label">Pilot profile</p>
      <h1 className="mt-3 text-5xl font-bold sm:text-7xl" style={{ perspective: 600 }}><SplitText text="My" /> <SplitText text="library" delay={0.15} className="text-glow text-ion" /></h1>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass hud rounded-2xl p-5">
            <s.icon className="h-5 w-5 text-ion" />
            <p className="mt-4 font-display text-4xl font-bold">{s.value}</p>
            <p className="label mt-1">{s.label}</p>
          </motion.div>
        ))}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="glass hud rounded-2xl p-5 sm:col-span-2 lg:col-span-1">
          <p className="label">Favourite genre</p>
          <p className="mt-4 font-display text-2xl font-bold text-plasma">{topGenre}</p>
        </motion.div>
      </div>

      <div className="mt-12 flex flex-wrap gap-2" role="tablist">
        {[...SHELVES.map((s) => ({ value: s.value as Shelf | "rated", label: s.label, color: s.color, count: list.filter((e) => e.shelf === s.value).length })), { value: "rated" as const, label: "My ratings", color: "hsl(var(--solar))", count: rated.length }].map((t) => (
          <button key={t.value} role="tab" aria-selected={tab === t.value} onClick={() => setTab(t.value)}
            className={cn("relative rounded-lg px-4 py-2.5 font-display text-sm font-semibold uppercase tracking-wider transition", tab === t.value ? "text-void" : "text-dim hover:text-star")}>
            {tab === t.value && <motion.span layoutId="lib-tab" className="absolute inset-0 rounded-lg" style={{ background: t.color, boxShadow: `0 0 24px -6px ${t.color}` }} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
            <span className="relative">{t.label} <span className="font-mono text-xs opacity-70">{t.count}</span></span>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            {tab === "rated" ? (
              rated.length === 0 ? (
                <Empty text="You haven't rated anything yet. Open any game and rate it." />
              ) : (
                <ul className="space-y-3">
                  {rated.map((r, i) => (
                    <motion.li key={r.game.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                      <Link href={`/games/${r.game.slug}`} className="glass hud group flex items-center gap-4 rounded-2xl p-3 pr-5">
                        <span className="w-8 text-center font-display text-2xl font-bold text-dim">{i + 1}</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {r.game.background_image && <img src={crop(r.game.background_image, 240)!} alt="" className="h-16 w-28 rounded-lg object-cover" />}
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-lg font-bold group-hover:text-ion">{r.game.name}</p>
                          {r.review ? <p className="line-clamp-1 text-sm text-dim">“{r.review}”</p> : <p className="font-mono text-xs text-dim">Story {r.story} · Gameplay {r.gameplay} · Graphics {r.graphics} · Sound {r.sound}</p>}
                        </div>
                        <span className="font-display text-3xl font-bold text-ion">{r.overall}<span className="text-sm text-dim">/10</span></span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              )
            ) : shown.length === 0 ? (
              <Empty text={`Nothing in ${SHELVES.find((s) => s.value === tab)!.label} yet. Use "Add to library" on any game.`} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {shown.map(({ game }, i) => (
                  <motion.div key={game.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }} className="glass hud group overflow-hidden rounded-2xl">
                    <Link href={`/games/${game.slug}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {game.background_image && <img src={crop(game.background_image, 480)!} alt="" className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105" />}
                    </Link>
                    <div className="p-4">
                      <Link href={`/games/${game.slug}`} className="line-clamp-1 font-display text-lg font-bold hover:text-ion">{game.name}</Link>
                      <div className="mt-1 flex items-center justify-between font-mono text-xs text-dim">
                        <span>{year(game.released)}{game.playtime ? ` · ~${game.playtime}h` : ""}</span>
                        {game.metacritic && <span style={{ color: metaColor(game.metacritic) }}>MC {game.metacritic}</span>}
                      </div>
                      <select value={tab} onChange={(e) => setShelf(game, e.target.value as Shelf)} aria-label={`Move ${game.name}`} className="mt-3 h-9 w-full rounded-lg border border-white/10 bg-void/60 px-2 text-xs outline-none focus:border-ion">
                        {SHELVES.map((s) => <option key={s.value} value={s.value}>Move to {s.label}</option>)}
                      </select>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="glass rounded-2xl py-16 text-center">
      <p className="font-display text-2xl font-bold uppercase">Empty hangar</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-dim">{text}</p>
      <Button asChild className="mt-6"><Link href="/games">Browse games</Link></Button>
    </div>
  );
}
