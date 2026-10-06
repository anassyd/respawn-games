"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, SlidersHorizontal, X } from "lucide-react";
import type { Game, Named, Paged } from "@/lib/types";
import { ORDERINGS, PLATFORMS, rawgClient } from "@/lib/rawg";
import { GameCard } from "@/components/games/game-card";
import { Skeleton } from "@/components/ui/skeleton";
import { SetupNotice } from "@/components/ui/setup-notice";
import { cn } from "@/lib/utils";

const iso = (d: Date) => d.toISOString().slice(0, 10);
const YEARS = ["2026", "2025", "2024", "2023", "2022", "2020s", "2010s", "2000s", "1990s"];
const yearRange = (y: string) => {
  if (y.endsWith("s")) { const s = Number(y.slice(0, 4)); return `${s}-01-01,${s + 9}-12-31`; }
  return `${y}-01-01,${y}-12-31`;
};

function Browse() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const search = sp.get("search") ?? "";
  const genres = sp.get("genres") ?? "";
  const platform = sp.get("platform") ?? "";
  const ordering = sp.get("ordering") ?? (search ? "" : "-added");
  const yr = sp.get("year") ?? "";
  const upcoming = sp.get("upcoming") === "1";

  const set = (k: string, v: string | null) => {
    const next = new URLSearchParams(sp);
    v ? next.set(k, v) : next.delete(k);
    router.replace(`${pathname}?${next}`, { scroll: false });
  };

  const { data: genreList } = useQuery({
    queryKey: ["genres"],
    queryFn: () => rawgClient<Paged<Named>>("/genres"),
    staleTime: Infinity,
  });

  const params = {
    search: search || undefined,
    search_precise: search ? "true" : undefined,
    genres: genres || undefined,
    parent_platforms: platform || undefined,
    ordering: ordering || undefined,
    dates: upcoming ? `${iso(new Date(Date.now() + 864e5))},${iso(new Date(Date.now() + 365 * 864e5))}` : yr ? yearRange(yr) : undefined,
    page_size: 20,
  };

  const q = useInfiniteQuery({
    queryKey: ["games", params],
    queryFn: ({ pageParam }) => rawgClient<Paged<Game>>("/games", { ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last, all) => (last.next ? all.length + 1 : undefined),
  });

  // Infinite scroll: load the next page when the sentinel enters the viewport.
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && q.hasNextPage && !q.isFetchingNextPage && q.fetchNextPage(), { rootMargin: "600px" });
    io.observe(el);
    return () => io.disconnect();
  }, [q]);

  const games = q.data?.pages.flatMap((p) => p.results) ?? [];
  const total = q.data?.pages[0]?.count ?? 0;
  const activeGenre = genreList?.results.find((g) => g.slug === genres);
  const title = search ? `“${search}”` : upcoming ? "Coming soon" : activeGenre ? activeGenre.name : "All games";
  const missingKey = (q.error as Error | null)?.message.includes("RAWG_API_KEY");

  return (
    <div className="container py-10">
      <p className="label">Database · {total ? total.toLocaleString() : "…"} results</p>
      <motion.h1 key={title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mt-2 text-4xl font-bold sm:text-6xl">{title}</motion.h1>

      <div className="glass sticky top-[80px] z-20 mt-8 rounded-2xl p-3">
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="ml-1 h-4 w-4 text-ion" />
          <select value={ordering} onChange={(e) => set("ordering", e.target.value)} aria-label="Sort by" className="h-9 rounded-lg border border-white/10 bg-void/60 px-3 text-sm outline-none focus:border-ion">
            {search && <option value="">Best match</option>}
            {ORDERINGS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select value={genres} onChange={(e) => set("genres", e.target.value || null)} aria-label="Genre" className="h-9 rounded-lg border border-white/10 bg-void/60 px-3 text-sm outline-none focus:border-ion">
            <option value="">All genres</option>
            {genreList?.results.map((g) => <option key={g.id} value={g.slug}>{g.name}</option>)}
          </select>
          <select value={yr} onChange={(e) => set("year", e.target.value || null)} aria-label="Release year" className="h-9 rounded-lg border border-white/10 bg-void/60 px-3 text-sm outline-none focus:border-ion" disabled={upcoming}>
            <option value="">Any year</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Platform">
            {PLATFORMS.map((p) => (
              <button key={p.id} onClick={() => set("platform", platform === p.id ? null : p.id)} aria-pressed={platform === p.id}
                className={cn("h-9 rounded-lg border px-3 text-xs font-semibold uppercase tracking-wider transition", platform === p.id ? "border-ion bg-ion/15 text-ion shadow-[0_0_16px_-4px_hsl(var(--ion))]" : "border-white/10 text-dim hover:text-star")}>
                {p.label}
              </button>
            ))}
          </div>
          {(search || genres || platform || yr || upcoming) && (
            <button onClick={() => router.replace(pathname)} className="ml-auto flex h-9 items-center gap-1 rounded-lg px-3 text-xs uppercase tracking-wider text-dim hover:text-plasma">
              <X className="h-4 w-4" /> Reset
            </button>
          )}
        </div>
      </div>

      <div className="mt-8">
        {missingKey ? (
          <SetupNotice />
        ) : q.isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="aspect-[16/13]" />)}</div>
        ) : q.isError ? (
          <p className="py-16 text-center text-dim">Couldn&apos;t load games. <button onClick={() => q.refetch()} className="text-ion underline">Retry</button></p>
        ) : games.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-3xl font-bold uppercase">No signal</p>
            <p className="mt-2 text-dim">Nothing matches these filters. Try fewer filters or another search.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {games.map((g, i) => <GameCard key={`${g.id}-${i}`} game={g} index={i} />)}
            </AnimatePresence>
          </div>
        )}
        <div ref={sentinel} className="flex h-24 items-center justify-center">
          {q.isFetchingNextPage && <Loader2 className="h-6 w-6 animate-spin text-ion" />}
          {!q.hasNextPage && games.length > 0 && <p className="label">End of transmission</p>}
        </div>
      </div>
    </div>
  );
}

export default function GamesPage() {
  return <Suspense><Browse /></Suspense>;
}
