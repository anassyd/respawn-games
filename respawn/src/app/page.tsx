import Link from "next/link";
import { Dices, LayoutList, Swords } from "lucide-react";
import { hasRawgKey, rawgServer } from "@/lib/rawg";
import { Hero } from "@/components/home/hero";
import { GenreMarquee } from "@/components/home/genre-marquee";
import { LegendsStrip } from "@/components/home/legends-strip";
import { GameRail } from "@/components/games/game-rail";
import { GameCard } from "@/components/games/game-card";
import { SectionTitle } from "@/components/ui/section-title";
import { SetupNotice } from "@/components/ui/setup-notice";
import { Reveal } from "@/components/fx/reveal";

export const revalidate = 3600;

const MODES = [
  { href: "/tier-list", icon: LayoutList, title: "Tier list maker", text: "Drag games and characters into S to D tiers, then export it as an image.", color: "var(--ion)" },
  { href: "/compare", icon: Swords, title: "Versus mode", text: "Put two games head to head on scores, playtime and reviews. You decide who wins.", color: "var(--plasma)" },
  { href: "/quiz", icon: Dices, title: "What should I play?", text: "Answer four quick questions and get games matched to your mood.", color: "var(--solar)" },
];

export default async function HomePage() {
  if (!hasRawgKey()) {
    return <div className="container py-32"><SetupNotice /></div>;
  }

  const [trending, topRated, upcoming, popular, genres] = await Promise.all([
    rawgServer.trending(),
    rawgServer.topRated(),
    rawgServer.upcoming(),
    rawgServer.allTimePopular(),
    rawgServer.genres(),
  ]);
  const spotlight = trending.results.filter((g) => g.background_image).slice(0, 5);

  return (
    <>
      <Hero spotlight={spotlight} />

      <section className="container mt-10">
        <SectionTitle kicker="Signal strength: high" title="Trending now" href="/games?ordering=-added" />
        <GameRail games={trending.results} />
      </section>

      <section className="mt-24">
        <div className="container"><SectionTitle kicker="Choose your sector" title="Genres" href="/games" linkLabel="Browse all" /></div>
        <GenreMarquee genres={genres.results} />
      </section>

      <section className="container mt-24">
        <SectionTitle kicker="Critics' highest marks" title="Masterpieces" href="/games?ordering=-metacritic" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {topRated.results.slice(0, 8).map((g, i) => <GameCard key={g.id} game={g} index={i} />)}
        </div>
      </section>

      <section className="container mt-24">
        <SectionTitle kicker="Hall of legends" title="Iconic characters" href="/characters" />
        <LegendsStrip />
      </section>

      <section className="container mt-24">
        <SectionTitle kicker="Incoming transmissions" title="Coming soon" href={`/games?ordering=-added&upcoming=1`} />
        <GameRail games={upcoming.results} />
      </section>

      <section className="container mt-24">
        <div className="grid gap-5 md:grid-cols-3">
          {MODES.map((m, i) => (
            <Reveal key={m.href} delay={i * 0.1}>
              <Link href={m.href} className="hud glass group relative block h-full overflow-hidden rounded-2xl p-7 transition hover:-translate-y-1">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-3xl transition-opacity group-hover:opacity-60" style={{ background: `hsl(${m.color})` }} />
                <m.icon className="h-8 w-8" style={{ color: `hsl(${m.color})` }} />
                <h3 className="mt-6 text-2xl font-bold">{m.title}</h3>
                <p className="mt-2 text-sm text-dim">{m.text}</p>
                <span className="mt-6 inline-block font-mono text-xs uppercase tracking-widest" style={{ color: `hsl(${m.color})` }}>Launch →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container mt-24">
        <SectionTitle kicker="Most added of all time" title="Played by millions" href="/games?ordering=-added" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {popular.results.map((g, i) => <GameCard key={g.id} game={g} index={i} />)}
        </div>
      </section>
    </>
  );
}
