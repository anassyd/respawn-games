import { NextResponse } from "next/server";
import { getCharacter } from "@/lib/characters";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  try {
    return NextResponse.json(await getCharacter(id));
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json({ error: msg }, { status: msg === "not_found" ? 404 : 502 });
  }
}
