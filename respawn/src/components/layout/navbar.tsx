"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, Search, X } from "lucide-react";
import { useLibrary } from "@/store/library";
import { useMounted } from "@/lib/use-mounted";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/games", label: "Games" },
  { href: "/characters", label: "Characters" },
  { href: "/tier-list", label: "Tier list" },
  { href: "/compare", label: "Versus" },
  { href: "/quiz", label: "What to play" },
  { href: "/library", label: "Library" },
];

function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Respawn home">
      <span className="relative grid h-9 w-9 place-items-center">
        <span className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-ion/60" />
        <span className="h-3 w-3 rotate-45 bg-ion shadow-[0_0_14px_hsl(var(--ion))] transition-transform group-hover:rotate-[225deg]" />
      </span>
      <span className="font-display text-xl font-bold uppercase tracking-[0.18em]">Re<span className="text-ion">spawn</span></span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useMounted();
  const libraryCount = useLibrary((s) => Object.keys(s.entries).length);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));
  useEffect(() => { setOpen(false); setSearching(false); }, [pathname]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/games?search=${encodeURIComponent(q.trim())}`);
    setQ("");
  };

  return (
    <header className={cn("sticky top-0 z-40 transition-all duration-300", scrolled ? "border-b border-white/10 bg-void/70 backdrop-blur-xl" : "bg-transparent")}>
      <div className="container flex h-[72px] items-center gap-6">
        <Logo />
        <nav aria-label="Main" className="hidden flex-1 items-center gap-1 lg:flex">
          {LINKS.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} className={cn("relative px-3 py-2 font-display text-sm font-semibold uppercase tracking-wider transition-colors", active ? "text-ion" : "text-dim hover:text-star")}>
                {active && <motion.span layoutId="nav-glow" className="absolute inset-x-2 -bottom-[13px] h-[2px] bg-ion shadow-[0_0_12px_hsl(var(--ion))]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                {l.label}
                {l.href === "/library" && mounted && libraryCount > 0 && (
                  <span className="ml-1.5 rounded bg-plasma/20 px-1.5 font-mono text-[10px] text-plasma">{libraryCount}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <AnimatePresence initial={false}>
            {searching && (
              <motion.form
                onSubmit={submit}
                role="search"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && setSearching(false)}
                  placeholder="Search 800k+ games"
                  aria-label="Search games"
                  className="h-10 w-full rounded-lg border border-ion/40 bg-void/70 px-3 text-sm outline-none placeholder:text-dim focus:border-ion"
                />
              </motion.form>
            )}
          </AnimatePresence>
          <button onClick={() => setSearching((s) => !s)} aria-label={searching ? "Close search" : "Search games"} className="grid h-10 w-10 place-items-center rounded-lg text-dim transition hover:bg-white/5 hover:text-ion">
            {searching ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>
          <button onClick={() => setOpen(true)} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-lg text-dim hover:bg-white/5 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 bg-void/95 backdrop-blur-xl lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="container flex h-[72px] items-center justify-between">
              <Logo />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="grid h-10 w-10 place-items-center rounded-lg hover:bg-white/5"><X className="h-5 w-5" /></button>
            </div>
            <nav className="container mt-8 flex flex-col gap-2" aria-label="Mobile">
              {LINKS.map((l, i) => (
                <motion.div key={l.href} initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.05 * i }}>
                  <Link href={l.href} className="block py-3 font-display text-4xl font-bold uppercase tracking-wide hover:text-ion">
                    <span className="mr-3 font-mono text-sm text-ion">0{i + 1}</span>{l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
