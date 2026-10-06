"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BookmarkPlus, Check, X } from "lucide-react";
import { toast } from "sonner";
import type { Game } from "@/lib/types";
import { SHELVES, snap, useLibrary, type Shelf } from "@/store/library";
import { useMounted } from "@/lib/use-mounted";
import { cn } from "@/lib/utils";

const MENU_WIDTH = 192; // w-48
const GAP = 8;
const EDGE = 8;

/** "Add to library" dropdown: Playing / Completed / Backlog / Wishlist. */
export function ShelfMenu({ game, compact }: { game: Game; compact?: boolean }) {
  const mounted = useMounted();
  const entry = useLibrary((s) => s.entries[game.id]);
  const setShelf = useLibrary((s) => s.setShelf);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const current = mounted ? entry?.shelf : undefined;
  const meta = SHELVES.find((s) => s.value === current);

  /**
   * The menu is portalled to <body> and positioned against the trigger, because every
   * ancestor here sits inside a stacking context — the page's reveal animations use
   * opacity and blur, and the cards use transforms — so an absolutely positioned menu
   * is painted under whatever comes after it, however high its z-index.
   */
  const place = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const height = menuRef.current?.offsetHeight ?? 0;

    const below = window.innerHeight - rect.bottom - GAP;
    // Flip above the trigger when there isn't room underneath but there is above.
    const flip = height > 0 && below < height && rect.top - GAP > height;

    setPos({
      top: flip ? rect.top - GAP - height : rect.bottom + GAP,
      left: Math.min(Math.max(EDGE, rect.left), window.innerWidth - MENU_WIDTH - EDGE),
    });
  }, []);

  // Measure once the menu exists so the flip decision uses its real height.
  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    // A fixed menu would drift away from its trigger, so follow the page instead.
    const onScroll = () => place();
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open, place]);

  const choose = (shelf: Shelf | null) => {
    setShelf(snap(game), shelf);
    setOpen(false);
    toast(shelf ? `${game.name} → ${SHELVES.find((s) => s.value === shelf)!.label}` : `Removed ${game.name} from your library`);
  };

  const menu = (
    <AnimatePresence>
      {open && (
        <motion.ul
          ref={menuRef}
          role="menu"
          initial={{ opacity: 0, y: -6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.96 }}
          transition={{ duration: 0.14 }}
          style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999, width: MENU_WIDTH }}
          className="glass fixed z-[60] origin-top-left rounded-xl bg-deep/95 p-1.5 shadow-2xl"
        >
          {SHELVES.map((s) => (
            <li key={s.value}>
              <button role="menuitemradio" aria-checked={current === s.value} onClick={(e) => { e.preventDefault(); choose(s.value); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm hover:bg-white/5">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
                <span className="flex-1">{s.label}</span>
                {current === s.value && <Check className="h-4 w-4 text-ion" />}
              </button>
            </li>
          ))}
          {current && (
            <li className="mt-1 border-t border-white/10 pt-1">
              <button role="menuitem" onClick={(e) => { e.preventDefault(); choose(null); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-dim hover:bg-white/5 hover:text-star">
                <X className="h-4 w-4" /> Remove
              </button>
            </li>
          )}
        </motion.ul>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={(e) => { e.preventDefault(); setOpen((o) => !o); }}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={meta ? `In ${meta.label}. Change shelf` : "Add to library"}
        className={cn(
          "flex items-center gap-2 border backdrop-blur-md transition",
          compact ? "h-9 rounded-lg px-2.5 text-xs" : "h-11 rounded-xl px-4 font-display text-sm font-semibold uppercase tracking-wider",
          meta ? "bg-void/70" : "border-white/15 bg-void/60 hover:border-ion/60 hover:text-ion"
        )}
        style={meta ? { borderColor: meta.color, color: meta.color } : undefined}
      >
        {meta ? <Check className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
        {(!compact || meta) && <span>{meta?.label ?? "Add to library"}</span>}
      </button>
      {mounted && createPortal(menu, document.body)}
    </div>
  );
}
