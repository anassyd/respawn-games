import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Gamepad2, User } from "lucide-react";
import { getCharacter } from "@/lib/characters";
import { proxyImg } from "@/lib/utils";
import type { CharacterDetail } from "@/lib/types";
import { Reveal } from "@/components/fx/reveal";
import { AddCharacterToTier } from "@/components/characters/add-to-tier";

type Props = { params: { id: string } };
export const revalidate = 604800;

async function load(id: string): Promise<CharacterDetail | null> {
  const n = Number(id);
  if (!Number.isInteger(n)) return null;
  try {
    return await getCharacter(n);
  } catch (e) {
    if (/not_found/i.test((e as Error).message)) return null;
    throw e;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await load(params.id);
  return c ? { title: c.name, description: c.deck ?? undefined } : { title: "Character" };
}

export default async function CharacterPage({ params }: Props) {
  const c = await load(params.id);
  if (!c) notFound();

  const facts = [
    ["Real name", c.realName],
    ["Gender", c.gender],
    ["Birthday", c.birthday],
    ["First appearance", c.firstGame],
    ["Franchise", c.franchises.slice(0, 3).join(", ")],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <div className="container py-14">
      <div className="grid items-start gap-12 lg:grid-cols-[400px_1fr]">
        <Reveal className="lg:sticky lg:top-28">
          <div className="hud relative overflow-hidden rounded-3xl border border-white/10 bg-deep">
            <div className="pointer-events-none absolute -inset-20 bg-[radial-gradient(closest-side,hsl(var(--ion)/0.25),transparent)]" />
            {c.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={proxyImg(c.image)} alt={c.name} className="relative aspect-[3/4] w-full object-cover object-top" />
            ) : (
              <div className="relative grid aspect-[3/4] place-items-center"><User className="h-20 w-20 text-dim" /></div>
            )}
            <div className="pointer-events-none absolute inset-0 overflow-hidden"><div className="h-1/4 w-full animate-scan bg-gradient-to-b from-transparent via-ion/15 to-transparent" /></div>
          </div>
          <AddCharacterToTier character={{ id: c.id, name: c.name, image: c.image }} />
        </Reveal>

        <div>
          <Reveal>
            <p className="label">Character file #{String(c.id).padStart(5, "0")}</p>
            <h1 className="text-glow mt-3 text-5xl font-bold sm:text-7xl">{c.name}</h1>
            {c.aliases.length > 0 && <p className="mt-3 font-mono text-sm text-plasma">a.k.a. {c.aliases.join(" · ")}</p>}
            {c.deck && <p className="mt-6 max-w-2xl text-xl leading-relaxed text-star/90">{c.deck}</p>}
          </Reveal>

          {facts.length > 0 && (
            <Reveal delay={0.1} className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {facts.map(([k, v]) => (
                <div key={k} className="glass rounded-xl p-4">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-dim">{k}</p>
                  <p className="mt-1 font-medium">{v}</p>
                </div>
              ))}
            </Reveal>
          )}

          {c.bio.length > 0 && (
            <Reveal delay={0.15} className="mt-12">
              <h2 className="mb-4 text-2xl font-bold">Dossier</h2>
              <div className="max-w-3xl space-y-4 leading-relaxed text-star/80">
                {c.bio.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </Reveal>
          )}

          {c.games.length > 0 && (
            <Reveal delay={0.2} className="mt-12">
              <h2 className="mb-4 text-2xl font-bold">Appears in <span className="font-mono text-base text-dim">({c.games.length}{c.games.length === 24 ? "+" : ""})</span></h2>
              <ul className="flex flex-wrap gap-2">
                {c.games.map((g) => (
                  <li key={g.id}>
                    <Link href={`/games?search=${encodeURIComponent(g.name)}`} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm transition hover:border-ion/60 hover:text-ion">
                      <Gamepad2 className="h-3.5 w-3.5" /> {g.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {c.url && (
            <a href={c.url} target="_blank" rel="noreferrer" className="mt-10 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-ion hover:underline">
              Full profile on the wiki <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
