"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import type { Character } from "@/lib/types";
import { proxyImg } from "@/lib/utils";

export function CharacterCard({ character, index = 0 }: { character: Character; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateY: -20 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 800 }}
    >
      <Link href={`/characters/${character.id}`} className="hud group block overflow-hidden rounded-2xl border border-white/10 bg-deep">
        <div className="relative aspect-[3/4] overflow-hidden">
          {character.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={proxyImg(character.image)} alt={character.name} loading="lazy" className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-110 group-hover:saturate-150" />
          ) : (
            <div className="grid h-full place-items-center bg-white/[0.03]"><User className="h-12 w-12 text-dim" /></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/10 to-transparent" />
          {/* scanline sweep on hover */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity group-hover:opacity-100">
            <div className="h-1/3 w-full animate-scan bg-gradient-to-b from-transparent via-ion/20 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="font-display text-lg font-bold leading-tight transition-colors group-hover:text-ion">{character.name}</h3>
            {character.firstGame && <p className="mt-0.5 line-clamp-1 font-mono text-[11px] text-dim">{character.firstGame}</p>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
