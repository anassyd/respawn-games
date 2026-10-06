"use client";

import { motion } from "framer-motion";
import { CharacterCard } from "@/components/characters/character-card";
import { Skeleton } from "@/components/ui/skeleton";
import { SplitText } from "@/components/fx/reveal";
import { useLegends } from "@/components/home/legends-strip";

export default function CharactersPage() {
  const { data, isLoading, error } = useLegends();

  return (
    <div className="container py-14">
      <p className="label">Hall of legends · portraits from the community wikis</p>
      <h1 className="mt-3 text-5xl font-bold sm:text-7xl" style={{ perspective: 600 }}>
        <SplitText text="Iconic" /> <SplitText text="characters" delay={0.2} className="text-glow text-ion" />
      </h1>
      <p className="mt-4 max-w-xl text-dim">
        The heroes, villains and mascots that defined gaming — a hand-picked roster of {data?.length ?? 24}, from
        the arcade era to the present.
      </p>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="label mt-10">
        Legends of the medium
      </motion.p>

      <div className="mt-5">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 24 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4]" />)}
          </div>
        ) : error || !data?.length ? (
          <p className="py-16 text-center text-dim">Couldn&apos;t load the roster right now. Try again in a minute.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {data.map((c, i) => <CharacterCard key={c.id} character={c} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
