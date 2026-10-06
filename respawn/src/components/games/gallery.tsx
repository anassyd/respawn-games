"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import type { Movie } from "@/lib/types";
import { crop } from "@/lib/utils";

/** Screenshot grid that expands into a full-screen lightbox (shared-element animation). */
export function Gallery({ images, movie, name }: { images: string[]; movie: Movie | null; name: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + images.length) % images.length)), [images.length]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [index, step]);

  return (
    <>
      {movie && (
        <div className="hud mb-4 overflow-hidden rounded-2xl border border-white/10">
          <video controls preload="none" poster={movie.preview} className="aspect-video w-full bg-black">
            <source src={movie.data.max} type="video/mp4" />
          </video>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.slice(0, 9).map((src, i) => (
          <motion.button
            key={src}
            layoutId={`shot-${src}`}
            onClick={() => setIndex(i)}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className={`hud group relative overflow-hidden rounded-xl border border-white/10 ${i === 0 ? "col-span-2 row-span-2" : ""}`}
            aria-label={`Open screenshot ${i + 1} of ${images.length}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={crop(src, i === 0 ? 1280 : 640)!} alt="" loading="lazy" className="aspect-video h-full w-full object-cover transition duration-500 group-hover:scale-110" />
            <span className="absolute inset-0 grid place-items-center bg-void/40 opacity-0 transition group-hover:opacity-100"><Play className="h-8 w-8 text-ion" /></span>
          </motion.button>
        ))}
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {index !== null && (
              <motion.div className="fixed inset-0 z-[70] flex items-center justify-center bg-void/95 p-4 backdrop-blur-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIndex(null)} role="dialog" aria-modal="true" aria-label={`${name} screenshots`}>
                <motion.img
                  key={images[index]}
                  layoutId={`shot-${images[index]}`}
                  src={images[index]}
                  alt={`${name} screenshot ${index + 1}`}
                  className="max-h-[85vh] max-w-full rounded-xl border border-white/10 shadow-[0_0_80px_-20px_hsl(var(--ion))]"
                  onClick={(e) => e.stopPropagation()}
                />
                <button onClick={() => setIndex(null)} aria-label="Close" className="glass absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full hover:text-ion"><X className="h-5 w-5" /></button>
                {images.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous" className="glass absolute left-4 grid h-12 w-12 place-items-center rounded-full hover:text-ion"><ChevronLeft /></button>
                    <button onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next" className="glass absolute right-4 grid h-12 w-12 place-items-center rounded-full hover:text-ion"><ChevronRight /></button>
                    <p className="absolute bottom-6 font-mono text-xs text-dim">{index + 1} / {images.length}</p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
