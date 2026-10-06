import { NextResponse } from "next/server";
import { legends } from "@/lib/characters";

/** GET /api/characters → the curated hall of legends. */
export async function GET() {
  try {
    return NextResponse.json(await legends());
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
