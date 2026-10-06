"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DndContext, DragOverlay, KeyboardSensor, PointerSensor, TouchSensor, closestCorners, useDroppable, useSensor, useSensors,
  type DragEndEvent, type DragOverEvent, type DragStartEvent, type UniqueIdentifier,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";
import { toPng } from "html-to-image";
import { Download, Gamepad2, Plus, RotateCcw, Search, User, X } from "lucide-react";
import { toast } from "sonner";
import type { Character, Game, Paged } from "@/lib/types";
import { rawgClient } from "@/lib/rawg";
import { TIERS, useTierList, type Board, type TierId, type TierItem } from "@/store/tierlist";
import { useMounted } from "@/lib/use-mounted";
import { cn, crop } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SplitText } from "@/components/fx/reveal";
import { fetchJSON } from "@/components/home/legends-strip";

function Tile({ item, overlay, onRemove }: { item: TierItem; overlay?: boolean; onRemove?: () => void }) {
  return (
    <div className={cn("group relative h-20 w-20 overflow-hidden rounded-lg border border-white/10 bg-deep sm:h-24 sm:w-24", overlay && "scale-110 shadow-[0_0_40px_-6px_hsl(var(--ion))] ring-2 ring-ion")}>
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/api/img?url=${encodeURIComponent(item.kind === "game" ? crop(item.image, 200)! : item.image)}`} alt="" className={cn("h-full w-full", item.kind === "game" ? "object-cover" : "object-cover object-top")} draggable={false} />
      ) : (
        <div className="grid h-full place-items-center">{item.kind === "game" ? <Gamepad2 className="h-6 w-6 text-dim" /> : <User className="h-6 w-6 text-dim" />}</div>
      )}
      <span className="absolute inset-x-0 bottom-0 truncate bg-void/80 px-1 py-0.5 text-center text-[10px] font-medium">{item.name}</span>
      {onRemove && (
        <button onPointerDown={(e) => e.stopPropagation()} onClick={onRemove} aria-label={`Remove ${item.name}`} className="absolute right-0.5 top-0.5 hidden h-5 w-5 place-items-center rounded bg-void/80 group-hover:grid">
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

function SortableTile({ item, onRemove }: { item: TierItem; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} {...attributes} {...listeners}
      aria-label={`${item.name}. Press space to move.`} className={cn("cursor-grab touch-none rounded-lg active:cursor-grabbing", isDragging && "opacity-30")}>
      <Tile item={item} onRemove={onRemove} />
    </li>
  );
}

function Row({ id, label, color, items, onRemove }: { id: TierId; label: string; color?: string; items: TierItem[]; onRemove: (id: string) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div className={cn("flex min-h-[96px] overflow-hidden rounded-xl border transition-colors sm:min-h-[112px]", isOver ? "border-ion/70 bg-ion/5" : "border-white/10 bg-white/[0.02]")}>
      {id !== "pool" && (
        <div className="grid w-16 flex-none place-items-center font-display text-4xl font-bold text-void sm:w-24" style={{ background: color, boxShadow: `0 0 30px -6px ${color}` }}>{label}</div>
      )}
      <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
        <ul ref={setNodeRef} className="flex flex-1 flex-wrap content-start gap-2 p-2">
          {items.map((it) => <SortableTile key={it.id} item={it} onRemove={() => onRemove(it.id)} />)}
          {items.length === 0 && id === "pool" && <li className="p-4 text-sm text-dim">Search above to add games and characters, then drag them into a tier.</li>}
        </ul>
      </SortableContext>
    </div>
  );
}

function AddPanel() {
  const [kind, setKind] = useState<"game" | "character">("game");
  const [q, setQ] = useState("");
  const [term, setTerm] = useState("");
  const add = useTierList((s) => s.add);
  useEffect(() => { const t = setTimeout(() => setTerm(q.trim()), 400); return () => clearTimeout(t); }, [q]);

  const games = useQuery({
    queryKey: ["tier-search", "game", term],
    queryFn: () => rawgClient<Paged<Game>>("/games", { search: term, page_size: 8 }),
    enabled: kind === "game" && term.length >= 2,
  });
  const chars = useQuery({
    queryKey: ["tier-search", "character", term],
    queryFn: () => fetchJSON<Character[]>(`/api/characters?q=${encodeURIComponent(term)}`),
    enabled: kind === "character" && term.length >= 2,
  });
  const results: TierItem[] =
    kind === "game"
      ? (games.data?.results ?? []).map((g) => ({ id: `g-${g.id}`, kind: "game", name: g.name, image: g.background_image }))
      : (chars.data ?? []).map((c) => ({ id: `c-${c.id}`, kind: "character", name: c.name, image: c.image }));
  const loading = (kind === "game" ? games : chars).isFetching;

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg bg-void/60 p-1">
          {(["game", "character"] as const).map((k) => (
            <button key={k} onClick={() => setKind(k)} aria-pressed={kind === k} className={cn("rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider", kind === k ? "bg-ion text-void" : "text-dim")}>
              {k === "game" ? "Games" : "Characters"}
            </button>
          ))}
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-void/60 px-3">
          <Search className="h-4 w-4 text-dim" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={kind === "game" ? "Search games to add" : "Search characters to add"} aria-label="Search to add" className="h-10 flex-1 bg-transparent text-sm outline-none placeholder:text-dim" />
        </div>
      </div>
      <AnimatePresence>
        {term.length >= 2 && (
          <motion.ul initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {loading && results.length === 0 && <li className="p-3 text-sm text-dim">Scanning…</li>}
            {!loading && results.length === 0 && <li className="p-3 text-sm text-dim">No results.</li>}
            {results.map((r) => (
              <li key={r.id} className="flex-none">
                <button onClick={() => toast(add(r) ? `Added ${r.name}` : `${r.name} is already on the board`)} className="group relative block" aria-label={`Add ${r.name}`}>
                  <Tile item={r} />
                  <span className="absolute inset-0 grid place-items-center rounded-lg bg-void/60 opacity-0 transition group-hover:opacity-100"><Plus className="h-6 w-6 text-ion" /></span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TierListPage() {
  const mounted = useMounted();
  const { title, board, setTitle, setBoard, remove, reset } = useTierList();
  const [local, setLocal] = useState<Board>(board);
  const [active, setActive] = useState<UniqueIdentifier | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!active) setLocal(board); }, [board, active]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const find = (id: UniqueIdentifier): TierId | undefined =>
    id in local ? (id as TierId) : (Object.keys(local) as TierId[]).find((k) => local[k].some((i) => i.id === id));
  const activeItem = active ? Object.values(local).flat().find((i) => i.id === active) : undefined;

  const onStart = ({ active }: DragStartEvent) => setActive(active.id);
  const onOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    const from = find(active.id), to = find(over.id);
    if (!from || !to || from === to) return;
    setLocal((prev) => {
      const a = [...prev[from]], b = [...prev[to]];
      const idx = a.findIndex((i) => i.id === active.id);
      if (idx < 0) return prev;
      const [moved] = a.splice(idx, 1);
      const overIdx = over.id in prev ? b.length : b.findIndex((i) => i.id === over.id);
      b.splice(overIdx < 0 ? b.length : overIdx, 0, moved);
      return { ...prev, [from]: a, [to]: b };
    });
  };
  const onEnd = ({ active, over }: DragEndEvent) => {
    const col = find(active.id);
    let next = local;
    if (col && over) {
      const items = local[col];
      const o = items.findIndex((i) => i.id === active.id);
      const n = over.id in local ? items.length - 1 : items.findIndex((i) => i.id === over.id);
      if (n >= 0 && o !== n) next = { ...local, [col]: arrayMove(items, o, n) };
    }
    setLocal(next);
    setBoard(next);
    setActive(null);
  };

  const exportImage = async () => {
    if (!exportRef.current) return;
    try {
      const url = await toPng(exportRef.current, { backgroundColor: "#040510", pixelRatio: 2, cacheBust: true });
      const a = Object.assign(document.createElement("a"), { href: url, download: `${title.replace(/\W+/g, "-").toLowerCase() || "tier-list"}.png` });
      a.click();
      toast.success("Tier list saved as an image");
    } catch {
      toast.error("Export failed. Wait for all images to load, then try again.");
    }
  };

  if (!mounted) return <div className="container py-14" />;
  const total = Object.values(local).flat().length;

  return (
    <div className="container py-14">
      <p className="label">Ranking module</p>
      <h1 className="mt-3 text-5xl font-bold sm:text-7xl" style={{ perspective: 600 }}><SplitText text="Tier list" /> <SplitText text="maker" delay={0.2} className="text-glow text-ion" /></h1>
      <p className="mt-4 max-w-xl text-dim">Rank games, characters or both. Drag with a mouse or finger, or use Space and the arrow keys. Your board saves automatically.</p>

      <div className="mt-8"><AddPanel /></div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={exportImage} disabled={total === 0}><Download /> Export PNG</Button>
        <Button variant="ghost" size="sm" onClick={() => confirm("Clear the whole board?") && reset()} disabled={total === 0}><RotateCcw /> Reset</Button>
        <span className="ml-auto font-mono text-xs text-dim">{total} items</span>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onStart} onDragOver={onOver} onDragEnd={onEnd} onDragCancel={() => { setActive(null); setLocal(board); }}>
        <div ref={exportRef} className="mt-4 space-y-2 rounded-2xl p-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Tier list title" className="mb-2 w-full bg-transparent font-display text-2xl font-bold uppercase tracking-wide outline-none focus:text-ion" />
          {TIERS.map((t) => <Row key={t.id} id={t.id} label={t.id} color={t.color} items={local[t.id]} onRemove={remove} />)}
        </div>
        <div className="mt-6">
          <p className="label mb-2">Unranked</p>
          <Row id="pool" label="" items={local.pool} onRemove={remove} />
        </div>
        <DragOverlay dropAnimation={{ duration: 200, easing: "cubic-bezier(.2,0,0,1)" }}>{activeItem ? <Tile item={activeItem} overlay /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}
