// Same-origin image proxy used by the tier list, so "Export PNG" can read the pixels
// (browsers block canvas export of images from other domains).
// Game art comes from RAWG, character portraits from the community wikis' image CDN.
// Match each host or a subdomain of it.
const ALLOWED = ["media.rawg.io", "static.wikia.nocookie.net"];
const allowedHost = (host: string) => ALLOWED.some((h) => host === h || host.endsWith(`.${h}`));

export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("url");
  let target: URL;
  try {
    target = new URL(raw ?? "");
  } catch {
    return new Response("Bad url", { status: 400 });
  }
  if (target.protocol !== "https:" || !allowedHost(target.hostname)) return new Response("Host not allowed", { status: 400 });

  let res: Response;
  try {
    res = await fetch(target, { headers: { "User-Agent": "Respawn-portfolio-app/1.0" }, redirect: "follow", next: { revalidate: 604800 } });
  } catch {
    return new Response("Upstream unreachable", { status: 502 });
  }
  if (!res.ok || !res.headers.get("content-type")?.startsWith("image/")) return new Response("Not found", { status: 404 });
  return new Response(res.body, {
    headers: { "Content-Type": res.headers.get("content-type")!, "Cache-Control": "public, max-age=604800, immutable" },
  });
}
