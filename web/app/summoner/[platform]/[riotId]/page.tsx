import { notFound } from "next/navigation";
import { ProfileHeader } from "@/components/ProfileHeader";
import { RankCard } from "@/components/RankCard";
import { LiveGameBadge } from "@/components/LiveGameBadge";
import { SearchBar } from "@/components/SearchBar";
import { MatchHistory } from "./MatchHistory";
import { getLatestVersion } from "@/lib/ddragon";
import {
  getAccountByRiotId,
  getRankedEntries,
  getSummonerByPuuid,
  RiotError,
} from "@/lib/riot";
import type { ProfilePayload, RankedEntry } from "@/lib/types";

interface PageProps {
  params: { platform: string; riotId: string };
}

async function loadProfile(
  platform: string,
  riotId: string
): Promise<ProfilePayload | { error: string; status: number }> {
  const decoded = decodeURIComponent(riotId);
  const sep = decoded.lastIndexOf("-");
  if (sep === -1) return { error: "Invalid Riot ID", status: 400 };
  const name = decoded.slice(0, sep);
  const tag = decoded.slice(sep + 1);
  try {
    const account = await getAccountByRiotId(name, tag, platform);
    const summoner = await getSummonerByPuuid(account.puuid, platform);
    const ranked: RankedEntry[] = await getRankedEntries(summoner.id, platform);
    return { account, summoner, ranked, platform };
  } catch (e) {
    if (e instanceof RiotError) return { error: e.message, status: e.status };
    return { error: "Unexpected error", status: 500 };
  }
}

export default async function SummonerPage({ params }: PageProps) {
  const platform = params.platform.toLowerCase();
  const result = await loadProfile(platform, params.riotId);
  const version = await getLatestVersion();

  if ("error" in result) {
    if (result.status === 404) notFound();
    return (
      <div className="max-w-2xl mx-auto">
        <SearchBar />
        <div className="mt-8 rounded-xl border border-loss/30 bg-loss/10 p-6 text-center">
          <div className="text-loss font-semibold">Couldn’t load profile</div>
          <div className="text-sm text-muted-foreground mt-1">
            {result.error}
          </div>
        </div>
      </div>
    );
  }

  const solo = result.ranked.find((r) => r.queueType === "RANKED_SOLO_5x5");
  const flex = result.ranked.find((r) => r.queueType === "RANKED_FLEX_SR");

  return (
    <div className="space-y-6">
      <SearchBar size="sm" />

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <ProfileHeader profile={result} version={version} />
        </div>
      </div>

      <div className="flex justify-end">
        <LiveGameBadge platform={platform} puuid={result.account.puuid} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col sm:flex-row gap-4">
          <RankCard queue="RANKED_SOLO_5x5" entry={solo} />
          <RankCard queue="RANKED_FLEX_SR" entry={flex} />
        </div>
      </div>

      <MatchHistory
        platform={platform}
        puuid={result.account.puuid}
        version={version}
      />
    </div>
  );
}
