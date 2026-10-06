import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * The only resized copies RAWG actually stores. Any other width redirects to api.rawg.io,
 * which 404s — so a requested width is snapped up to the next one of these rather than
 * passed through. ("/crop/" has the same trap: it exists only at 600x400.)
 */
const RAWG_WIDTHS = [200, 420, 600, 640, 1280, 1920, 2560];

/** RAWG serves a resized copy when "/resize/W/-/" is inserted after "/media/" ("-" keeps the aspect ratio). */
export function crop(url: string | null | undefined, w = 640) {
  if (!url) return null;
  if (!url.includes("media.rawg.io/media/") || /\/media\/(resize|crop)\//.test(url)) return url;
  const width = RAWG_WIDTHS.find((candidate) => candidate >= w) ?? RAWG_WIDTHS[RAWG_WIDTHS.length - 1];
  return url.replace("media.rawg.io/media/", `media.rawg.io/media/resize/${width}/-/`);
}

/**
 * Route an image through our own origin. The wikis' CDN serves a blank placeholder when it
 * sees a cross-site Referer, so character portraits must not be hotlinked directly.
 */
export const proxyImg = (url: string) => `/api/img?url=${encodeURIComponent(url)}`;

export const year = (date: string | null) => (date ? date.slice(0, 4) : "TBA");

export function metaColor(score: number | null) {
  if (score === null) return "hsl(var(--dim))";
  if (score >= 75) return "#3ee08f";
  if (score >= 50) return "#f5c542";
  return "#ff5d5d";
}

/** "2013-09-17" → "Sep 17, 2013". Parsed as a plain calendar date, so the timezone can't shift it. */
export function formatDate(date: string | null | undefined) {
  if (!date) return "TBA";
  const [y, m, d] = date.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return "TBA";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(Date.UTC(y, m - 1, d)));
}

export const formatNumber = (n: number) => new Intl.NumberFormat("en", { notation: "compact" }).format(n);

/** Platform slug → short label for chips. */
export const PLATFORM_LABEL: Record<string, string> = {
  pc: "PC",
  playstation: "PlayStation",
  xbox: "Xbox",
  nintendo: "Nintendo",
  ios: "iOS",
  android: "Android",
  mac: "Mac",
  linux: "Linux",
  web: "Web",
};

export const stripHtml = (html: string) =>
  html.replace(/<(script|style|figure|table)[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/\s+/g, " ").trim();
