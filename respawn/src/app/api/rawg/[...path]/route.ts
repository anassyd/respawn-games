import { NextResponse } from "next/server";

// Proxies GET /api/rawg/<path>?<query> → https://api.rawg.io/api/<path>?<query>&key=...
// Only read endpoints the app uses are allowed.
const ALLOWED = /^(games|genres|platforms)(\/[\w-]+)?(\/(screenshots|movies|game-series|additions))?$/;

export async function GET(req: Request, { params }: { params: { path: string[] } }) {
  const key = process.env.RAWG_API_KEY;
  if (!key) return NextResponse.json({ error: "Add RAWG_API_KEY to .env.local", code: "missing_key" }, { status: 503 });

  const path = params.path.join("/");
  if (!ALLOWED.test(path)) return NextResponse.json({ error: "Not allowed" }, { status: 400 });

  const search = new URL(req.url).searchParams;
  search.set("key", key);
  const res = await fetch(`https://api.rawg.io/api/${path}?${search}`, { next: { revalidate: 1800 } });
  const body = await res.json().catch(() => ({}));
  return NextResponse.json(res.ok ? body : { error: body?.detail ?? `RAWG error ${res.status}` }, { status: res.status });
}
