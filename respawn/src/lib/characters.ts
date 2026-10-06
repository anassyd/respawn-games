// Characters — a curated hall of legends.
//
// This used to come from the Giant Bomb API, which was switched off when Giant Bomb left
// Fandom, and then from IGDB, which needs Twitch credentials that aren't available here.
// So the roster is curated in this file and only the portraits are fetched, from the
// community wikis' open MediaWiki API (no key, no auth).
//
// The trade-off is that there is no global character index to query, so this source can
// serve this list and nothing else — there is no free-text character search, and no way to
// look up the cast of an arbitrary game.
import type { Character, CharacterDetail } from "@/lib/types";

type Legend = {
  /** Stable and explicit: these ids are in URLs and in saved tier lists, so never renumber them. */
  id: number;
  name: string;
  /** MediaWiki host and article the portrait is read from. */
  wiki: string;
  page: string;
  firstGame: string;
  deck: string;
  bio: string;
  games: string[];
};

export const LEGENDS: Legend[] = [
  { id: 1, name: "Mario", wiki: "mario.fandom.com", page: "Mario", firstGame: "Donkey Kong",
    deck: "Nintendo's mascot and the most recognisable character in video games.",
    bio: "A plumber from the Mushroom Kingdom who began life in 1981 as the carpenter 'Jumpman', dodging barrels to rescue his girlfriend from an ape. He has since headlined platformers, kart racers, sports titles and role-playing games, and his 1985 and 1996 outings wrote the rulebook for 2D and 3D platforming respectively.",
    games: ["Donkey Kong", "Super Mario Bros.", "Super Mario 64", "Super Mario Odyssey", "Mario Kart 8 Deluxe"] },
  { id: 2, name: "Link", wiki: "zelda.fandom.com", page: "Link", firstGame: "The Legend of Zelda",
    deck: "The silent swordsman of Hyrule, reborn in every age to face Ganon.",
    bio: "Not one hero but a line of them: each Legend of Zelda game casts a new Link bearing the Triforce of Courage. Famously mute, he is a vessel for the player, and his 1986 and 1998 adventures defined the open-world and 3D action-adventure template that games still follow.",
    games: ["The Legend of Zelda", "The Legend of Zelda: Ocarina of Time", "The Legend of Zelda: Breath of the Wild", "The Legend of Zelda: Tears of the Kingdom"] },
  { id: 3, name: "Master Chief", wiki: "halo.fandom.com", page: "Master Chief", firstGame: "Halo: Combat Evolved",
    deck: "Spartan-117, the super-soldier who carried Xbox on his armoured shoulders.",
    bio: "John-117 was conscripted and augmented as a child into the SPARTAN-II programme. Paired with the AI Cortana, he became the face of Xbox and the anchor of a series that made the console first-person shooter work.",
    games: ["Halo: Combat Evolved", "Halo 2", "Halo 3", "Halo Infinite"] },
  { id: 4, name: "Kratos", wiki: "godofwar.fandom.com", page: "Kratos", firstGame: "God of War",
    deck: "The Ghost of Sparta — first a vengeance machine, later a father.",
    bio: "A Spartan general tricked into killing his own family, Kratos tore through the Greek pantheon across the original trilogy. The 2018 reboot relocated him to Norse myth and recast him as a restrained, ageing father, one of the medium's most striking reinventions of a character.",
    games: ["God of War", "God of War II", "God of War III", "God of War Ragnarök"] },
  { id: 5, name: "Lara Croft", wiki: "tombraider.fandom.com", page: "Lara Croft", firstGame: "Tomb Raider",
    deck: "Archaeologist and raider of tombs; gaming's first global action heroine.",
    bio: "Introduced in 1996, Lara made a woman the lead of a blockbuster action series and became a cultural shorthand for 3D gaming itself. The 2013 reboot retold her origin as a harder, more vulnerable survival story.",
    games: ["Tomb Raider", "Tomb Raider II", "Rise of the Tomb Raider", "Shadow of the Tomb Raider"] },
  { id: 6, name: "Geralt of Rivia", wiki: "witcher.fandom.com", page: "Geralt of Rivia", firstGame: "The Witcher",
    deck: "The White Wolf: a mutated monster hunter for hire, and a reluctant moralist.",
    bio: "Adapted from Andrzej Sapkowski's novels, Geralt is a witcher — mutated from childhood to hunt monsters for coin. The games built their reputation on choices with no clean answer, culminating in The Witcher 3's sprawling, melancholy Continent.",
    games: ["The Witcher", "The Witcher 2: Assassins of Kings", "The Witcher 3: Wild Hunt"] },
  { id: 7, name: "Sonic the Hedgehog", wiki: "sonic.fandom.com", page: "Sonic the Hedgehog", firstGame: "Sonic the Hedgehog",
    deck: "Sega's blue blur, built to be everything Mario was not: fast and attitude-first.",
    bio: "Created in 1991 to give Sega a mascot with speed and swagger, Sonic turned the platformer into a momentum puzzle of loops and ramps. He carried the Mega Drive through the console wars and remains Sega's defining character.",
    games: ["Sonic the Hedgehog", "Sonic the Hedgehog 2", "Sonic Mania", "Sonic Frontiers"] },
  { id: 8, name: "Samus Aran", wiki: "metroid.fandom.com", page: "Samus Aran", firstGame: "Metroid",
    deck: "Bounty hunter in the Power Suit, and the namesake of a whole genre.",
    bio: "Metroid's 1986 ending revealing the armoured hunter as a woman is one of gaming's famous twists. Her games' interlocking, ability-gated maps gave half the name to 'Metroidvania', still one of the medium's most-copied structures.",
    games: ["Metroid", "Super Metroid", "Metroid Prime", "Metroid Dread"] },
  { id: 9, name: "Solid Snake", wiki: "metalgear.fandom.com", page: "Solid Snake", firstGame: "Metal Gear",
    deck: "The infiltrator who made avoiding a fight more interesting than winning one.",
    bio: "Hideo Kojima's soldier popularised stealth as a genre: Metal Gear Solid asked players to hide, distract and slip past rather than shoot. Snake anchored a series as famous for breaking the fourth wall as for its cardboard boxes.",
    games: ["Metal Gear", "Metal Gear Solid", "Metal Gear Solid 2: Sons of Liberty", "Metal Gear Solid 4: Guns of the Patriots"] },
  { id: 10, name: "Cloud Strife", wiki: "finalfantasy.fandom.com", page: "Cloud Strife", firstGame: "Final Fantasy VII",
    deck: "The spiky-haired mercenary with an oversized sword and a borrowed past.",
    bio: "Final Fantasy VII's lead sold the Japanese role-playing game to the West in 1997. Cloud presents as a detached ex-SOLDIER for hire, and the story's central turn is the unravelling of how much of that identity was ever his.",
    games: ["Final Fantasy VII", "Final Fantasy VII Remake", "Final Fantasy VII Rebirth"] },
  { id: 11, name: "Ellie", wiki: "thelastofus.fandom.com", page: "Ellie", firstGame: "The Last of Us",
    deck: "Immune to the infection, and the reason Joel damns everyone else.",
    bio: "A teenager born after the outbreak who is immune to the cordyceps infection, making her humanity's possible cure. Across two games she moves from cargo to protagonist, and the sequel turns her grief into a long, costly argument about revenge.",
    games: ["The Last of Us", "The Last of Us Part II"] },
  { id: 12, name: "Arthur Morgan", wiki: "reddead.fandom.com", page: "Arthur Morgan", firstGame: "Red Dead Redemption 2",
    deck: "An outlaw running out of frontier, and out of time.",
    bio: "Enforcer for the Van der Linde gang in 1899, Arthur narrates the closing of the American West through a journal and a worsening cough. He is widely held to be Rockstar's most fully realised character.",
    games: ["Red Dead Redemption 2"] },
  { id: 13, name: "Aloy", wiki: "horizon.fandom.com", page: "Aloy", firstGame: "Horizon Zero Dawn",
    deck: "Outcast hunter picking apart a world of machines and buried history.",
    bio: "Raised an outcast among the Nora, Aloy hunts robotic beasts across a post-collapse Earth while uncovering what ended the old world. The series pairs tactical creature hunting with one of the stronger science-fiction mysteries in modern games.",
    games: ["Horizon Zero Dawn", "Horizon Forbidden West"] },
  { id: 14, name: "Nathan Drake", wiki: "uncharted.fandom.com", page: "Nathan Drake", firstGame: "Uncharted: Drake's Fortune",
    deck: "Treasure hunter, serial liar, and the charm offensive of the PlayStation 3 era.",
    bio: "A wisecracking fortune hunter claiming descent from Francis Drake, Nate carried Naughty Dog's push toward performance-captured, cinematic adventure, and set the template for the blockbuster set-piece game.",
    games: ["Uncharted: Drake's Fortune", "Uncharted 2: Among Thieves", "Uncharted 4: A Thief's End"] },
  { id: 15, name: "Doomguy", wiki: "gaming.fandom.com", page: "Doomguy", firstGame: "Doom",
    deck: "The marine who started the first-person shooter and never stopped moving.",
    bio: "Nameless and nearly silent in 1993, the Doom marine was a gun and a pair of boots. The modern games rebuilt him as the Doom Slayer, a figure so relentless that demons keep records of him — and kept the series' signature aggression intact.",
    games: ["Doom", "Doom II", "Doom (2016)", "Doom Eternal"] },
  { id: 16, name: "Pac-Man", wiki: "pacman.fandom.com", page: "Pac-Man", firstGame: "Pac-Man",
    deck: "A yellow circle with an appetite — the first true gaming icon.",
    bio: "Namco's 1980 maze game was designed to reach an audience beyond the era's shooters, and it worked: Pac-Man became the first video game character to break into mainstream merchandise and music, and remains the medium's clearest visual shorthand.",
    games: ["Pac-Man", "Ms. Pac-Man", "Pac-Man Championship Edition DX"] },
  { id: 17, name: "Mega Man", wiki: "megaman.fandom.com", page: "Mega Man", firstGame: "Mega Man",
    deck: "The Blue Bomber, who takes the weapon of every robot he defeats.",
    bio: "Capcom's robot boy fights themed Robot Masters and absorbs their powers, letting players choose their own order and difficulty curve. That weapon-stealing loop has been imitated for three decades.",
    games: ["Mega Man", "Mega Man 2", "Mega Man X", "Mega Man 11"] },
  { id: 18, name: "Ezio Auditore da Firenze", wiki: "assassinscreed.fandom.com", page: "Ezio Auditore da Firenze", firstGame: "Assassin's Creed II",
    deck: "A Florentine noble turned Master Assassin, followed across a whole lifetime.",
    bio: "Ezio is the only Assassin's Creed lead carried across three games, aging from a brash young noble avenging his family to an elder statesman of the Brotherhood — an unusual amount of time to spend with one character.",
    games: ["Assassin's Creed II", "Assassin's Creed: Brotherhood", "Assassin's Creed: Revelations"] },
  { id: 19, name: "Joel", wiki: "thelastofus.fandom.com", page: "Joel", firstGame: "The Last of Us",
    deck: "A smuggler who loses a daughter, finds another, and chooses her over the world.",
    bio: "Twenty years after losing his daughter on the night of the outbreak, Joel is hired to move a girl across a ruined America. The ending — in which he saves her at humanity's expense — is among the most argued-over in games.",
    games: ["The Last of Us", "The Last of Us Part II"] },
  { id: 20, name: "Pikachu", wiki: "pokemon.fandom.com", page: "Pikachu", firstGame: "Pokémon Red and Blue",
    deck: "Electric mouse, series mascot, and one of the most valuable characters alive.",
    bio: "One of 151 creatures in 1996's Pokémon Red and Green, Pikachu was elevated to mascot by the anime and became the face of a franchise spanning games, cards, film and television — by most measures the highest-grossing media franchise ever.",
    games: ["Pokémon Red and Blue", "Pokémon Yellow", "Pokémon GO", "Pokémon Scarlet and Violet"] },
  { id: 21, name: "Commander Shepard", wiki: "masseffect.fandom.com", page: "Commander Shepard", firstGame: "Mass Effect",
    deck: "The first human Spectre — and whoever the player decided that should be.",
    bio: "Shepard's gender, appearance, background and morality are the player's to set, and those choices carry across an entire trilogy. The result is a protagonist who belongs to each player differently, which is exactly what made the ending so contentious.",
    games: ["Mass Effect", "Mass Effect 2", "Mass Effect 3"] },
  { id: 22, name: "Gordon Freeman", wiki: "half-life.fandom.com", page: "Gordon Freeman", firstGame: "Half-Life",
    deck: "A theoretical physicist with a crowbar, and not one line of dialogue.",
    bio: "Gordon never speaks and the camera never leaves his eyes — Valve told Half-Life's story through scripted events happening around the player instead of cutscenes, an approach that reshaped how shooters handle narrative.",
    games: ["Half-Life", "Half-Life 2", "Half-Life 2: Episode Two"] },
  { id: 23, name: "Bayonetta", wiki: "bayonetta.fandom.com", page: "Bayonetta (character)", firstGame: "Bayonetta",
    deck: "An Umbra Witch who fights angels with guns in her heels and her own hair.",
    bio: "Hideki Kamiya's witch fights with pistols mounted on all four limbs and summons demons from her hair. Beneath the spectacle sits one of the most mechanically demanding character-action combat systems ever built.",
    games: ["Bayonetta", "Bayonetta 2", "Bayonetta 3"] },
  { id: 24, name: "2B", wiki: "nier.fandom.com", page: "2B", firstGame: "NieR:Automata",
    deck: "YoRHa No.2 Type B — an android fighting a war for a humanity that is already gone.",
    bio: "A combat android sent to reclaim Earth from machine lifeforms, 2B anchors a game that asks players to replay it from new perspectives, each pass reframing what the last one meant. Yoko Taro's structure makes the repetition the point.",
    games: ["NieR:Automata"] },
];

const byId = new Map(LEGENDS.map((l) => [l.id, l]));
const WEEK = 1000 * 60 * 60 * 24 * 7;
const UA = "Respawn-portfolio-app/1.0 (https://github.com/)";

/* ---------- portraits ---------- */

const portraits = new Map<number, { at: number; url: string | null }>();

/**
 * The lead image of a wiki article. `pageimages` returns the infobox portrait, and
 * `redirects=1` follows the common-name title to the real article (Master Chief → John-117).
 */
async function portrait(l: Legend): Promise<string | null> {
  const hit = portraits.get(l.id);
  if (hit && Date.now() - hit.at < WEEK) return hit.url;

  const url =
    `https://${l.wiki}/api.php?action=query&format=json&origin=*` +
    `&prop=pageimages&piprop=original&redirects=1&titles=${encodeURIComponent(l.page)}`;

  let found: string | null = null;
  // These wikis drop connections fairly often, so a couple of quick retries are worth it.
  for (let attempt = 0; attempt < 3 && !found; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA }, next: { revalidate: 604800 } });
      if (!res.ok) continue;
      const body = (await res.json()) as { query?: { pages?: Record<string, { original?: { source?: string } }> } };
      const page = Object.values(body.query?.pages ?? {})[0];
      found = page?.original?.source ?? null;
    } catch {
      // try again
    }
  }

  portraits.set(l.id, { at: Date.now(), url: found });
  return found;
}

/**
 * The wikis store full-resolution art — some of it over a megabyte — so ask their
 * thumbnailer for a sensible width. The segment goes before the cache-busting query.
 */
function scaleTo(url: string | null, width: number) {
  if (!url) return null;
  const [base, query] = url.split("?");
  return `${base}/scale-to-width-down/${width}${query ? `?${query}` : ""}`;
}

const toCharacter = async (l: Legend, width = 400): Promise<Character> => ({
  id: l.id,
  name: l.name,
  deck: l.deck,
  image: scaleTo(await portrait(l), width),
  firstGame: l.firstGame,
});

/* ---------- public API ---------- */

/** The curated hall of legends, in the order above. A portrait that won't load just comes back null. */
export async function legends(): Promise<Character[]> {
  // Note the arrow: passing `toCharacter` directly would hand it map's index as the width.
  return Promise.all(LEGENDS.map((l) => toCharacter(l)));
}

export async function getCharacter(id: number): Promise<CharacterDetail> {
  const l = byId.get(id);
  if (!l) throw new Error("not_found");
  return {
    // The dossier shows the portrait large, so it gets a bigger copy than the cards.
    ...(await toCharacter(l, 800)),
    // Curated entries carry no personal records, and the UI hides empty facts.
    realName: null,
    aliases: [],
    gender: null,
    birthday: null,
    bio: [l.bio],
    games: l.games.map((name, i) => ({ id: l.id * 100 + i, name })),
    franchises: [],
    url: `https://${l.wiki}/wiki/${encodeURIComponent(l.page)}`,
  };
}
