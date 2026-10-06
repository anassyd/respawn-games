import Link from "next/link";
import type { Named } from "@/lib/types";
import { crop } from "@/lib/utils";

type Genre = Named & { games_count: number; image_background: string };

/** Endless sliding band of genre tiles; pauses on hover. */
export function GenreMarquee({ genres }: { genres: Genre[] }) {
  const row = [...genres, ...genres];
  return (
    <div className="group relative overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <div className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused]">
        {row.map((g, i) => (
          <Link
            key={`${g.id}-${i}`}
            href={`/games?genres=${g.slug}`}
            aria-hidden={i >= genres.length}
            tabIndex={i >= genres.length ? -1 : undefined}
            className="hud relative h-28 w-56 flex-none overflow-hidden rounded-xl border border-white/10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={crop(g.image_background, 400)!} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-50 transition duration-500 hover:scale-110 hover:opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-void/90 to-void/10" />
            <div className="absolute bottom-3 left-4">
              <p className="font-display text-lg font-bold uppercase">{g.name}</p>
              <p className="font-mono text-[11px] text-dim">{g.games_count.toLocaleString()} games</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
