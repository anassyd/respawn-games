import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, ExternalLink } from "lucide-react";
import { hasRawgKey, rawgServer } from "@/lib/rawg";
import type { Movie, Paged, Screenshot, Game } from "@/lib/types";
import { crop, formatDate } from "@/lib/utils";
import { ScoreRing } from "@/components/fx/score-ring";
import { Reveal } from "@/components/fx/reveal";
import { GameBackdrop } from "@/components/games/game-backdrop";
import { GameActions } from "@/components/games/game-actions";
import { Gallery } from "@/components/games/gallery";
import { ExpandableText } from "@/components/games/expandable-text";
import { RatingPanel } from "@/components/games/rating-panel";
import { GameRail } from "@/components/games/game-rail";
import { SectionTitle } from "@/components/ui/section-title";
import { SetupNotice } from "@/components/ui/setup-notice";

type Props = { params: { slug: string } };
export const revalidate = 3600;

async function load(slug: string) {
  try {
    return await rawgServer.game(slug);
  } catch (e) {
    if ((e as Error).message === "not_found") return null;
    throw e;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!hasRawgKey()) return { title: "Game" };
  const g = await load(params.slug);
  return g ? { title: g.name, description: g.description_raw?.slice(0, 155), openGraph: { images: g.background_image ? [g.background_image] : [] } } : { title: "Game not found" };
}

const empty = <T,>(): Paged<T> => ({ count: 0, next: null, previous: null, results: [] });

export default async function GamePage({ params }: Props) {
  if (!hasRawgKey()) return <div className="container py-32"><SetupNotice /></div>;
  const game = await load(params.slug);
  if (!game) notFound();

  const [shots, movies, series] = await Promise.all([
    rawgServer.screenshots(game.slug).catch(() => empty<Screenshot>()),
    rawgServer.movies(game.slug).catch(() => empty<Movie>()),
    rawgServer.series(game.slug).catch(() => empty<Game>()),
  ]);

  const facts: [string, React.ReactNode][] = [
    ["Released", formatDate(game.released)],
    ["Developer", game.developers.map((d) => d.name).join(", ") || "—"],
    ["Publisher", game.publishers.map((p) => p.name).join(", ") || "—"],
    ["Platforms", game.parent_platforms?.map((p) => p.platform.name).join(", ") || "—"],
    ["Genres", game.genres.map((g) => g.name).join(", ") || "—"],
    ["Age rating", game.esrb_rating?.name ?? "Not rated"],
  ];
  const ratingColors: Record<string, string> = { exceptional: "#3ee08f", recommended: "hsl(var(--ion))", meh: "#f5c542", skip: "#ff5d5d" };
  const images = [game.background_image_additional, ...shots.results.map((s) => s.image)].filter(Boolean) as string[];
  const tags = game.tags.filter((t) => !t.language || t.language === "eng").slice(0, 12);

  return (
    <>
      <GameBackdrop image={crop(game.background_image, 1920)} />

      <div className="container relative -mt-[38vh]">
        <Reveal>
          <p className="label">{game.genres.map((g) => g.name).join(" / ")}</p>
          <h1 className="text-glow mt-3 max-w-4xl text-4xl font-bold normal-case leading-tight sm:text-6xl">{game.name}</h1>
        </Reveal>

        <Reveal delay={0.15} className="mt-8 flex flex-wrap items-center gap-8">
          <div className="flex items-center gap-3"><ScoreRing value={game.metacritic} label="Metacritic" size={72} /><span className="label">Meta<br />critic</span></div>
          <div className="flex items-center gap-3"><ScoreRing value={Number(game.rating.toFixed(1))} max={5} label="Player rating" size={72} color="hsl(var(--solar))" /><span className="label">Players<br />{game.ratings_count.toLocaleString()}</span></div>
          {game.playtime > 0 && <div className="flex items-center gap-2 font-mono text-sm text-dim"><Clock className="h-4 w-4 text-ion" /> ~{game.playtime}h avg playtime</div>}
          <GameActions game={game} />
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0 space-y-16">
            <Reveal>
              <h2 className="mb-4 text-2xl font-bold">Briefing</h2>
              <ExpandableText text={game.description_raw || "No description available."} />
              {tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {tags.map((t) => <span key={t.id} className="rounded-md border border-white/10 px-2 py-1 font-mono text-[11px] text-dim">#{t.slug}</span>)}
                </div>
              )}
            </Reveal>

            {(images.length > 0 || movies.results.length > 0) && (
              <section>
                <h2 className="mb-4 text-2xl font-bold">Visual feed</h2>
                <Gallery images={images} movie={movies.results[0] ?? null} name={game.name} />
              </section>
            )}

            <section id="rate">
              <RatingPanel game={game} />
            </section>
          </div>

          <aside className="space-y-6">
            <Reveal className="glass hud rounded-2xl p-6">
              <p className="label mb-4">Mission data</p>
              <dl className="space-y-4 text-sm">
                {facts.map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-[11px] uppercase tracking-widest text-dim">{k}</dt>
                    <dd className="mt-0.5">{v}</dd>
                  </div>
                ))}
              </dl>
              {game.website && (
                <a href={game.website} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm text-ion hover:underline">
                  Official website <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </Reveal>

            {game.ratings.length > 0 && (
              <Reveal delay={0.1} className="glass rounded-2xl p-6">
                <p className="label mb-4">Community verdict</p>
                <div className="mb-4 flex h-3 overflow-hidden rounded-full">
                  {game.ratings.map((r) => <span key={r.id} style={{ width: `${r.percent}%`, background: ratingColors[r.title] }} title={`${r.title} ${r.percent}%`} />)}
                </div>
                <ul className="space-y-2 text-sm">
                  {game.ratings.map((r) => (
                    <li key={r.id} className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: ratingColors[r.title] }} />
                      <span className="flex-1 capitalize">{r.title}</span>
                      <span className="font-mono text-dim">{r.percent.toFixed(0)}%</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </aside>
        </div>

        {series.results.length > 0 && (
          <section className="mt-24">
            <SectionTitle kicker="Same universe" title="More in the series" />
            <GameRail games={series.results} />
          </section>
        )}
      </div>
    </>
  );
}
