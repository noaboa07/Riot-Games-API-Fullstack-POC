"use client";

import { useQuery } from "@tanstack/react-query";
import { MatchCard } from "@/components/MatchCard";
import { ChampionStats } from "@/components/ChampionStats";
import { MatchHistorySkeleton } from "@/components/MatchHistorySkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MatchDTO } from "@/lib/types";

export function MatchHistory({
  platform,
  puuid,
  version,
}: {
  platform: string;
  puuid: string;
  version: string;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["matches", platform, puuid],
    queryFn: async () => {
      const res = await fetch(`/api/matches/${platform}/${puuid}?count=10`);
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      return res.json() as Promise<{ matches: MatchDTO[] }>;
    },
  });

  if (isLoading) {
    return (
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MatchHistorySkeleton />
        </div>
        <div className="hidden lg:block">
          <Card>
            <CardHeader>
              <CardTitle>Champion Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 skeleton rounded-md" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-loss">
          {(error as Error).message}
        </CardContent>
      </Card>
    );
  }

  const matches = data?.matches ?? [];
  if (matches.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          No recent matches found.
        </CardContent>
      </Card>
    );
  }

  const wins = matches.filter((m) =>
    m.info.participants.find((p) => p.puuid === puuid)?.win
  ).length;
  const wr = Math.round((wins / matches.length) * 100);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Recent Matches</h2>
          <div className="text-sm text-muted-foreground">
            {wins}W {matches.length - wins}L ·{" "}
            <span
              className={wr >= 50 ? "text-win font-semibold" : "text-loss font-semibold"}
            >
              {wr}%
            </span>
          </div>
        </div>
        {matches.map((m) => (
          <MatchCard
            key={m.metadata.matchId}
            match={m}
            puuid={puuid}
            version={version}
          />
        ))}
      </div>
      <div>
        <ChampionStats matches={matches} puuid={puuid} version={version} />
      </div>
    </div>
  );
}
