"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search } from "lucide-react";
import type { Game, Paged } from "@/lib/types";
import { rawgClient } from "@/lib/rawg";
import { crop, year } from "@/lib/utils";

/** Search-as-you-type game selector. */
export function GamePicker({ onPick, placeholder = "Search a game" }: { onPick: (g: Game) => void; placeholder?: string }) {
  const [q, setQ] = useState("");
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  useEffect(() => { const t = setTimeout(() => setTerm(q.trim()), 350); return () => clearTimeout(t); }, [q]);
  const { data, isFetching } = useQuery({
    queryKey: ["pick", term],
    queryFn: () => rawgClient<Paged<Game>>("/games", { search: term, page_size: 6 }),
    enabled: term.length >= 2,
  });
  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-void/70 px-3 focus-within:border-ion/60">
        {isFetching ? <Loader2 className="h-4 w-4 animate-spin text-ion" /> : <Search className="h-4 w-4 text-dim" />}
        <input value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder} aria-label={placeholder} className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-dim" />
      </div>
      <AnimatePresence>
        {open && term.length >= 2 && data && (
          <motion.ul initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="glass absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-xl bg-deep/95 shadow-2xl" role="listbox">
            {data.results.length === 0 && <li className="p-4 text-sm text-dim">No games found.</li>}
            {data.results.map((g) => (
              <li key={g.id}>
                <button role="option" aria-selected="false" onMouseDown={(e) => e.preventDefault()} onClick={() => { onPick(g); setQ(""); setOpen(false); }} className="flex w-full items-center gap-3 p-2.5 text-left hover:bg-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {g.background_image ? <img src={crop(g.background_image, 120)!} alt="" className="h-10 w-16 rounded object-cover" /> : <span className="h-10 w-16 rounded bg-white/5" />}
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{g.name}</span><span className="font-mono text-xs text-dim">{year(g.released)}</span></span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
