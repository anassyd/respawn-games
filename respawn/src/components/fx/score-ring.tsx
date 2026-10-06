"use client";

import { motion } from "framer-motion";
import { metaColor } from "@/lib/utils";

/** Animated circular gauge. `value` 0–max. */
export function ScoreRing({ value, max = 100, size = 64, label, color }: { value: number | null; max?: number; size?: number; label?: string; color?: string }) {
  const r = size / 2 - 5;
  const c = 2 * Math.PI * r;
  const pct = value === null ? 0 : Math.min(1, value / max);
  const stroke = color ?? metaColor(value === null ? null : (value / max) * 100);
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }} role="img" aria-label={`${label ?? "Score"} ${value ?? "not rated"}${value !== null ? ` out of ${max}` : ""}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--line))" strokeWidth={4} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - pct) }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 6px ${stroke})` }}
        />
      </svg>
      <span className="absolute font-display text-lg font-bold" style={{ color: stroke, fontSize: size * 0.28 }}>{value ?? "–"}</span>
    </div>
  );
}
