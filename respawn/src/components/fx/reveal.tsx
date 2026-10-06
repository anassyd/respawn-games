"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

/** Fades and lifts children into view once when scrolled to. */
export function Reveal({ delay = 0, y = 28, ...props }: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    />
  );
}

/** Splits a heading into letters that drop in with a stagger. */
export function SplitText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((word, wi, words) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden="true">
          {word.split("").map((ch, ci) => {
            const i = words.slice(0, wi).join("").length + ci;
            return (
              <motion.span
                key={ci}
                className="inline-block"
                initial={{ opacity: 0, y: "0.6em", rotateX: -90, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                transition={{ delay: delay + i * 0.035, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {ch}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
