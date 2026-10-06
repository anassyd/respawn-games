"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function ExpandableText({ text, limit = 600 }: { text: string; limit?: number }) {
  const [open, setOpen] = useState(false);
  const long = text.length > limit;
  const shown = open || !long ? text : text.slice(0, limit).trimEnd() + "…";
  return (
    <div>
      <motion.div layout className="space-y-4 whitespace-pre-line leading-relaxed text-star/85">{shown}</motion.div>
      {long && (
        <button onClick={() => setOpen((o) => !o)} className="mt-3 font-mono text-xs uppercase tracking-widest text-ion hover:underline">
          {open ? "Show less" : "Read full briefing"}
        </button>
      )}
    </div>
  );
}
