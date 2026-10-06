"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, RefreshCw, Sparkles } from "lucide-react";
import type { Game, Paged } from "@/lib/types";
import { rawgClient } from "@/lib/rawg";
import { cn } from "@/lib/utils";
import { GameCard } from "@/components/games/game-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Option = { label: string; hint: string; value: string };
const STEPS: { key: "mood" | "time" | "platform" | "era"; question: string; options: Option[] }[] = [
  {
    key: "mood",
    question: "What are you in the mood for?",
    options: [
      { label: "Adrenaline", hint: "Fast, loud, intense", value: "action,shooter" },
      { label: "A great story", hint: "Characters and choices", value: "role-playing-games-rpg,adventure" },
      { label: "Brain work", hint: "Plan, solve, outsmart", value: "puzzle,strategy" },
      { label: "Chill", hint: "Cosy and relaxing", value: "indie,casual,simulation" },
      { label: "Fear", hint: "Survival and dread", value: "tag:horror" },
      { label: "Play with friends", hint: "Co-op and versus", value: "massively-multiplayer,fighting,sports" },
    ],
  },
  {
    key: "time",
    question: "How much time do you have?",
    options: [
      { label: "A weekend", hint: "Under 10 hours", value: "short" },
      { label: "A few weeks", hint: "10–40 hours", value: "medium" },
      { label: "Months", hint: "40+ hours, a world to live in", value: "long" },
      { label: "Doesn't matter", hint: "Surprise me", value: "any" },
    ],
  },
  {
    key: "platform",
    question: "Where will you play?",
    options: [
      { label: "PC", hint: "Keyboard or pad", value: "1" },
      { label: "PlayStation", hint: "PS4 / PS5", value: "2" },
      { label: "Xbox", hint: "One / Series", value: "3" },
      { label: "Nintendo", hint: "Switch", value: "7" },
      { label: "Phone", hint: "iOS / Android", value: "4,8" },
    ],
  },
  {
    key: "era",
    question: "New releases or proven classics?",
    options: [
      { label: "Fresh", hint: "Last 3 years", value: "new" },
      { label: "Modern classics", hint: "2013 onwards", value: "modern" },
      { label: "All time", hint: "Any year", value: "any" },
    ],
  },
];

type Answers = Partial<Record<(typeof STEPS)[number]["key"], string>>;

function useRecommendations(a: Answers, enabled: boolean, seed: number) {
  const y = new Date().getFullYear();
  const dates = a.era === "new" ? `${y - 3}-01-01,${y}-12-31` : a.era === "modern" ? `2013-01-01,${y}-12-31` : undefined;
  return useQuery({
    queryKey: ["quiz", a, seed],
    enabled,
    queryFn: async () => {
      const res = await rawgClient<Paged<Game>>("/games", {
        genres: a.mood?.startsWith("tag:") ? undefined : a.mood,
        tags: a.mood?.startsWith("tag:") ? a.mood.slice(4) : undefined,
        parent_platforms: a.platform,
        dates,
        ordering: "-metacritic",
        metacritic: "70,100",
        page_size: 40,
      });
      const fits = (g: Game) =>
        a.time === "short" ? g.playtime > 0 && g.playtime < 10 : a.time === "medium" ? g.playtime >= 10 && g.playtime <= 40 : a.time === "long" ? g.playtime > 40 : true;
      const pool = res.results.filter(fits);
      const list = pool.length >= 3 ? pool : res.results;
      // shuffle with the seed so "Reroll" gives a new trio
      return [...list].sort((x, z) => ((x.id * 9301 + seed * 49297) % 233280) - ((z.id * 9301 + seed * 49297) % 233280)).slice(0, 3);
    },
  });
}

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [seed, setSeed] = useState(1);
  const done = step >= STEPS.length;
  const recs = useRecommendations(answers, done, seed);
  const current = STEPS[step];

  return (
    <div className="container max-w-5xl py-14">
      <p className="label">Recommendation engine</p>
      <h1 className="mt-3 text-4xl font-bold sm:text-6xl">What should I <span className="text-glow text-solar">play?</span></h1>

      <div className="mt-8 flex gap-2" aria-label={`Step ${Math.min(step + 1, STEPS.length)} of ${STEPS.length}`}>
        {STEPS.map((s, i) => (
          <div key={s.key} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full bg-solar shadow-[0_0_10px_hsl(var(--solar))]" animate={{ width: i < step ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
          </div>
        ))}
      </div>

      <div className="relative mt-10 min-h-[420px]">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div key={current.key} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              <p className="font-mono text-sm text-solar">0{step + 1} / 0{STEPS.length}</p>
              <h2 className="mt-2 text-3xl font-bold normal-case sm:text-4xl">{current.question}</h2>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {current.options.map((o, i) => (
                  <motion.button
                    key={o.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setAnswers((a) => ({ ...a, [current.key]: o.value })); setStep((s) => s + 1); }}
                    className={cn("glass hud rounded-2xl p-5 text-left transition hover:border-solar/60 hover:shadow-[0_0_40px_-12px_hsl(var(--solar))]", answers[current.key] === o.value && "border-solar/60")}
                  >
                    <p className="font-display text-xl font-bold uppercase">{o.label}</p>
                    <p className="mt-1 text-sm text-dim">{o.hint}</p>
                  </motion.button>
                ))}
              </div>
              {step > 0 && (
                <button onClick={() => setStep((s) => s - 1)} className="mt-8 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-dim hover:text-star">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 font-mono text-sm text-solar"><Sparkles className="h-4 w-4" /> Analysis complete</p>
                  <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Your next three worlds</h2>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSeed((s) => s + 1)}><RefreshCw /> Reroll</Button>
                  <Button variant="ghost" size="sm" onClick={() => { setStep(0); setAnswers({}); }}>Start over</Button>
                </div>
              </div>
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {recs.isLoading
                  ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="aspect-[16/13]" />)
                  : recs.isError
                    ? <p className="text-dim md:col-span-3">Couldn&apos;t reach the game database. {(recs.error as Error).message}</p>
                    : recs.data?.length === 0
                      ? <p className="text-dim md:col-span-3">No match for that combination. Try a different mood or platform.</p>
                      : recs.data?.map((g, i) => (
                          <motion.div key={g.id} initial={{ opacity: 0, y: 40, rotateX: -30 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.15 + i * 0.15, type: "spring", stiffness: 120, damping: 16 }} style={{ perspective: 800 }}>
                            <GameCard game={g} index={0} />
                          </motion.div>
                        ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
