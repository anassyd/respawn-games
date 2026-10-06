export type Named = { id: number; name: string; slug: string };

export type Game = {
  id: number;
  slug: string;
  name: string;
  released: string | null;
  tba?: boolean;
  background_image: string | null;
  rating: number; // 0–5 (RAWG community)
  ratings_count: number;
  metacritic: number | null;
  playtime: number;
  added?: number;
  genres: Named[];
  parent_platforms?: { platform: Named }[];
  short_screenshots?: { id: number; image: string }[];
};

export type GameDetail = Game & {
  description_raw: string;
  developers: Named[];
  publishers: Named[];
  website: string;
  esrb_rating: { name: string } | null;
  tags: (Named & { language?: string })[];
  background_image_additional: string | null;
  ratings: { id: number; title: string; count: number; percent: number }[];
};

export type Paged<T> = { count: number; next: string | null; previous: string | null; results: T[] };

export type Screenshot = { id: number; image: string; width: number; height: number };
export type Movie = { id: number; name: string; preview: string; data: { 480: string; max: string } };

export type Character = {
  id: number;
  name: string;
  deck: string | null;
  image: string | null;
  firstGame: string | null;
};

export type CharacterDetail = Character & {
  realName: string | null;
  aliases: string[];
  gender: string | null;
  birthday: string | null;
  bio: string[];
  games: { id: number; name: string }[];
  franchises: string[];
  url: string | null;
};
