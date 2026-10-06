"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Game } from "@/lib/types";
import { snap } from "@/store/library";
import { useRatings } from "@/store/ratings";
import { useMounted } from "@/lib/use-mounted";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/fx/score-ring";

const score = z.number().int().min(1).max(10);
const schema = z.object({
  overall: score,
  story: score,
  gameplay: score,
  graphics: score,
  sound: score,
  review: z.string().trim().max(1200, "Keep it under 1200 characters"),
});
type Values = z.infer<typeof schema>;
const ASPECTS: { key: Exclude<keyof Values, "review" | "overall">; label: string }[] = [
  { key: "story", label: "Story" },
  { key: "gameplay", label: "Gameplay" },
  { key: "graphics", label: "Graphics" },
  { key: "sound", label: "Sound" },
];
const VERDICT = ["", "Abandon ship", "Rough", "Weak", "Meh", "Okay", "Decent", "Good", "Great", "Amazing", "Legendary"];

function Slider({ value, onChange, label, big }: { value: number; onChange: (v: number) => void; label: string; big?: boolean }) {
  const pct = ((value - 1) / 9) * 100;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className={big ? "font-display text-lg font-bold uppercase" : "font-mono text-xs uppercase tracking-widest text-dim"}>{label}</label>
        <motion.span key={value} initial={{ scale: 1.5, color: "hsl(var(--ion))" }} animate={{ scale: 1, color: "hsl(var(--star))" }} className={big ? "font-display text-2xl font-bold" : "font-mono text-sm"}>{value}</motion.span>
      </div>
      <div className="relative h-6">
        <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-white/10" />
        <motion.div className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-plasma to-ion shadow-[0_0_14px_hsl(var(--ion))]" animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
        <input type="range" min={1} max={10} step={1} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={label}
          className="absolute inset-0 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-ion [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ion [&::-webkit-slider-thumb]:shadow-[0_0_14px_hsl(var(--ion))]" />
      </div>
    </div>
  );
}

/** Particles that burst out when a rating is saved. */
function Burst({ id }: { id: number }) {
  return (
    <div key={id} className="pointer-events-none absolute left-1/2 top-1/2">
      {Array.from({ length: 18 }).map((_, i) => {
        const a = (i / 18) * Math.PI * 2;
        return (
          <motion.span key={i} className="absolute h-1.5 w-1.5 rounded-full" style={{ background: i % 2 ? "hsl(var(--ion))" : "hsl(var(--plasma))" }}
            initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: Math.cos(a) * 140, y: Math.sin(a) * 140, opacity: 0 }} transition={{ duration: 0.9, ease: "easeOut" }} />
        );
      })}
    </div>
  );
}

export function RatingPanel({ game }: { game: Game }) {
  const mounted = useMounted();
  const existing = useRatings((s) => s.ratings[game.id]);
  const save = useRatings((s) => s.save);
  const remove = useRatings((s) => s.remove);
  const [burst, setBurst] = useState(0);
  const { control, register, handleSubmit, reset, watch, formState: { errors, isDirty } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { overall: 8, story: 7, gameplay: 8, graphics: 8, sound: 7, review: "" },
  });

  useEffect(() => {
    if (mounted && existing) reset({ overall: existing.overall, story: existing.story, gameplay: existing.gameplay, graphics: existing.graphics, sound: existing.sound, review: existing.review });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, existing?.updatedAt]);

  const overall = watch("overall");

  const onSubmit = (v: Values) => {
    save({ game: snap(game), ...v });
    setBurst(Date.now());
    toast.success(existing ? "Rating updated" : "Rating saved to your library");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="glass hud relative overflow-hidden rounded-2xl p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-plasma/20 blur-3xl" />
      <div className="relative flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="label">Your verdict</p>
          <h2 className="mt-1 text-3xl font-bold">{mounted && existing ? "Update your rating" : "Rate this game"}</h2>
        </div>
        <div className="relative flex items-center gap-4">
          <ScoreRing value={overall} max={10} size={84} label="Your score" color="hsl(var(--ion))" />
          <AnimatePresence mode="wait">
            <motion.p key={overall} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="font-display text-xl font-bold uppercase text-ion">{VERDICT[overall]}</motion.p>
          </AnimatePresence>
          <AnimatePresence>{burst > 0 && <Burst key={burst} id={burst} />}</AnimatePresence>
        </div>
      </div>

      <div className="relative mt-8 space-y-6">
        <Controller control={control} name="overall" render={({ field }) => <Slider big label="Overall" value={field.value} onChange={field.onChange} />} />
        <div className="grid gap-6 sm:grid-cols-2">
          {ASPECTS.map((a) => (
            <Controller key={a.key} control={control} name={a.key} render={({ field }) => <Slider label={a.label} value={field.value} onChange={field.onChange} />} />
          ))}
        </div>
        <div>
          <label htmlFor="review" className="font-mono text-xs uppercase tracking-widest text-dim">Review (optional)</label>
          <textarea id="review" rows={4} {...register("review")} placeholder="What made it stick with you? What fell flat?"
            className="mt-2 w-full rounded-xl border border-white/10 bg-void/60 p-4 text-sm outline-none placeholder:text-dim focus:border-ion/60 focus:shadow-[0_0_30px_-12px_hsl(var(--ion))]" />
          {errors.review && <p role="alert" className="mt-1 text-xs text-[#ff5d5d]">{errors.review.message}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={mounted && !!existing && !isDirty}>{mounted && existing ? "Update rating" : "Save rating"}</Button>
          {mounted && existing && (
            <Button type="button" variant="ghost" onClick={() => { remove(game.id); reset(); toast("Rating removed"); }}>
              <Trash2 /> Remove
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
