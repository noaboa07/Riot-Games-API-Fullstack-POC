import { NextResponse } from "next/server";
import { getActiveGame, RiotError } from "@/lib/riot";

export async function GET(
  _req: Request,
  { params }: { params: { platform: string; puuid: string } }
) {
  try {
    const game = await getActiveGame(params.puuid, params.platform.toLowerCase());
    return NextResponse.json({ game });
  } catch (e) {
    if (e instanceof RiotError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
