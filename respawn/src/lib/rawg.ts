// RAWG Video Games Database — https://rawg.io/apidocs
// Server components call RAWG directly with the key; the browser goes through /api/rawg/* (see route handler),
// so the key never ships to the client.
import type { Game, GameDetail, Movie, Named, Paged, Screenshot } from "@/lib/types";

const RAWG = "https://api.rawg.io/api";
export const hasRawgKey = () => !!process.env.RAWG_API_KEY;

export class MissingKeyError extends Error {
  constructor(public service: "RAWG") {
    super(`${service} API key is missing`);
  }
}

type Params = Record<string, string | number | undefined>;

export function qs(params: Params) {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v !== undefined && v !== "" && p.set(k, String(v)));
  return p.toString();
}

/** Server-side fetch to RAWG (cached by Next for `revalidate` seconds). */
export async function rawg<T>(path: string, params: Params = {}, revalidate = 3600): Promise<T> {
  const key = process.env.RAWG_API_KEY;
  if (!key) throw new MissingKeyError("RAWG");
  const res = await fetch(`${RAWG}${path}?${qs({ ...params, key })}`, { next: { revalidate } });
  if (res.status === 404) throw new Error("not_found");
  if (!res.ok) throw new Error(`RAWG ${res.status} on ${path}`);
  return res.json() as Promise<T>;
}

const iso = (d: Date) => d.toISOString().slice(0, 10);
const shift = (days: number) => iso(new Date(Date.now() + days * 864e5));

export const rawgServer = {
  trending: () => rawg<Paged<Game>>("/games", { dates: `${shift(-120)},${shift(0)}`, ordering: "-added", page_size: 12 }),
  topRated: () => rawg<Paged<Game>>("/games", { ordering: "-metacritic", metacritic: "85,100", page_size: 12 }),
  allTimePopular: () => rawg<Paged<Game>>("/games", { ordering: "-added", page_size: 8 }),
  upcoming: () => rawg<Paged<Game>>("/games", { dates: `${shift(1)},${shift(365)}`, ordering: "-added", page_size: 10 }),
  genres: () => rawg<Paged<Named & { games_count: number; image_background: string }>>("/genres", {}, 86400),
  game: (slug: string) => rawg<GameDetail>(`/games/${slug}`),
  screenshots: (slug: string) => rawg<Paged<Screenshot>>(`/games/${slug}/screenshots`),
  movies: (slug: string) => rawg<Paged<Movie>>(`/games/${slug}/movies`),
  series: (slug: string) => rawg<Paged<Game>>(`/games/${slug}/game-series`, { page_size: 8 }),
};

/* ---------- browser helpers (through the proxy) ---------- */

export type BrowseFilters = {
  search?: string;
  genres?: string;
  parent_platforms?: string;
  ordering?: string;
  dates?: string;
};

export async function rawgClient<T>(path: string, params: Params = {}): Promise<T> {
  const res = await fetch(`/api/rawg${path}?${qs(params)}`);
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(body?.error ?? `Request failed (${res.status})`);
  return body as T;
}

export const PLATFORMS = [
  { id: "1", label: "PC" },
  { id: "2", label: "PlayStation" },
  { id: "3", label: "Xbox" },
  { id: "7", label: "Nintendo" },
  { id: "4", label: "iOS" },
  { id: "8", label: "Android" },
];

export const ORDERINGS = [
  { value: "-added", label: "Most popular" },
  { value: "-metacritic", label: "Metacritic score" },
  { value: "-rating", label: "Player rating" },
  { value: "-released", label: "Newest" },
  { value: "name", label: "Name A–Z" },
];
