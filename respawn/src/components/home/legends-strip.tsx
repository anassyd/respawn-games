"use client";

import { useQuery } from "@tanstack/react-query";
import type { Character } from "@/lib/types";
import { CharacterCard } from "@/components/characters/character-card";
import { Skeleton } from "@/components/ui/skeleton";

export async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(body?.error ?? `Request failed (${res.status})`) as Error & { code?: string };
    err.code = body?.code;
    throw err;
  }
  return body as T;
}

export function useLegends() {
  return useQuery({ queryKey: ["characters", "legends"], queryFn: () => fetchJSON<Character[]>("/api/characters"), staleTime: Infinity });
}

export function LegendsStrip({ limit = 8 }: { limit?: number }) {
  const { data, isLoading, error } = useLegends();
  if (error) return <p className="text-sm text-dim">Characters couldn&apos;t load right now. Try again in a minute.</p>;
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
      {isLoading || !data
        ? Array.from({ length: limit }).map((_, i) => <Skeleton key={i} className="aspect-[3/4]" />)
        : data.slice(0, limit).map((c, i) => <CharacterCard key={c.id} character={c} index={i} />)}
    </div>
  );
}
