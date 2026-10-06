# Respawn — discover, rate and rank games

A space-themed game discovery app: the most popular games, iconic characters, personal ratings, a library,
tier lists, head-to-head comparisons and a "what should I play?" quiz.

Next.js 14 · TypeScript · Tailwind CSS · TanStack Query · Zustand · React Hook Form + Zod · Framer Motion · dnd-kit

## 1. Get a free API key

| Data | API | Key |
| --- | --- | --- |
| Games, screenshots, trailers, ratings, genres | [RAWG](https://rawg.io/apidocs) | Sign up → "Get API key" |

Characters need no key: the roster is curated in `src/lib/characters.ts` and portraits come from the
community wikis' open MediaWiki API.


## 2. Run

```bash
npm install
cp .env.example .env.local      # Windows: copy .env.example .env.local
# paste your RAWG key into .env.local
npm run dev
```

Open http://localhost:3000. If the RAWG key is missing, the page tells you.

## Pages

- `/` — hero with rotating trending spotlight, trending rail, genre marquee, masterpieces, iconic characters, upcoming games
- `/games` — browse 800k+ games: search, genre, platform, year, sorting, infinite scroll
- `/games/[slug]` — parallax backdrop, Metacritic and player score rings, briefing, screenshot lightbox, trailer,
  community verdict, your rating (overall + story / gameplay / graphics / sound + review), series
- `/characters` and `/characters/[id]` — a curated roster of 24 legends, each with a portrait, dossier and notable games
- `/tier-list` — drag games and characters into S–D tiers (mouse, touch, keyboard), export as PNG
- `/compare` — two games head to head with animated stat bars and a vote
- `/quiz` — four questions → three recommendations, with reroll
- `/library` — Playing / Completed / Backlog / Wishlist shelves, your ratings ranked, profile stats

## Animation and effects

Canvas starfield with depth parallax, shooting stars and a warp jump on every page change · letter-by-letter
headings · 3D tilt cards with glare and screenshot scrubbing · HUD corner brackets · scanline sweeps · animated
score rings · genre marquee · shared-element screenshot lightbox · spring sliders and particle burst when rating ·
cursor glow · scroll reveals. Everything respects "reduce motion".

## How it's wired

- `src/lib/rawg.ts` — RAWG calls. Server pages use the key directly; the browser goes through `/api/rawg/*`
  so the key is never exposed.
- `src/lib/characters.ts` — the curated hall of legends. Giant Bomb's API (the original source) was switched off
  when it left Fandom, and IGDB needs Twitch credentials, so the roster lives in this file and only the portraits
  are fetched, from the community wikis' MediaWiki API. No key, but it can serve only this list: there is no
  character search and no per-game cast.
- `/api/img` — same-origin image proxy so the tier list can be exported as an image.
- `src/store/*` — library, ratings and tier list, saved in the browser with Zustand.

## Credits

Game data and images © RAWG and their publishers. Character portraits © their respective publishers, via Fandom.
RAWG requires a visible link back, which is in the footer.
