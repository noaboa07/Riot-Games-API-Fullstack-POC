import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { championSquareUrl } from "@/lib/ddragon";
import { kdaRatio } from "@/lib/utils";
import type { MatchDTO } from "@/lib/types";

interface Stat {
  championName: string;
  games: number;
  wins: number;
  k: number;
  d: number;
  a: number;
}

export function ChampionStats({
  matches,
  puuid,
  version,
}: {
  matches: MatchDTO[];
  puuid: string;
  version: string;
}) {
  const map = new Map<string, Stat>();
  for (const m of matches) {
    const me = m.info.participants.find((p) => p.puuid === puuid);
    if (!me) continue;
    const cur =
      map.get(me.championName) ?? {
        championName: me.championName,
        games: 0,
        wins: 0,
        k: 0,
        d: 0,
        a: 0,
      };
    cur.games += 1;
    cur.wins += me.win ? 1 : 0;
    cur.k += me.kills;
    cur.d += me.deaths;
    cur.a += me.assists;
    map.set(me.championName, cur);
  }

  const stats = Array.from(map.values())
    .sort((a, b) => b.games - a.games)
    .slice(0, 5);

  if (stats.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Champion Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stats.map((s) => {
          const wr = Math.round((s.wins / s.games) * 100);
          return (
            <div key={s.championName} className="flex items-center gap-3">
              <Image
                src={championSquareUrl(s.championName, version)}
                alt={s.championName}
                width={40}
                height={40}
                unoptimized
                className="rounded-md"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{s.championName}</div>
                <div className="text-xs text-muted-foreground">
                  {kdaRatio(s.k / s.games, s.d / s.games, s.a / s.games)} KDA
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-sm font-semibold ${
                    wr >= 50 ? "text-win" : "text-loss"
                  }`}
                >
                  {wr}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {s.games} games
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
