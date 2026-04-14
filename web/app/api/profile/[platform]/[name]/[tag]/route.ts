import { NextResponse } from "next/server";
import {
  getAccountByRiotId,
  getRankedEntries,
  getSummonerByPuuid,
  RiotError,
} from "@/lib/riot";

export async function GET(
  _req: Request,
  { params }: { params: { platform: string; name: string; tag: string } }
) {
  try {
    const platform = params.platform.toLowerCase();
    const account = await getAccountByRiotId(
      decodeURIComponent(params.name),
      decodeURIComponent(params.tag),
      platform
    );
    const summoner = await getSummonerByPuuid(account.puuid, platform);
    const ranked = await getRankedEntries(summoner.id, platform);
    return NextResponse.json({ account, summoner, ranked, platform });
  } catch (e) {
    if (e instanceof RiotError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
