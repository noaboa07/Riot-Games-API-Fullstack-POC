"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  championSquareUrl,
  itemIconUrl,
  summonerSpellIconUrl,
} from "@/lib/ddragon";
import { queueName } from "@/lib/queues";
import { formatDuration, kdaRatio, timeAgo, cn } from "@/lib/utils";
import type { MatchDTO } from "@/lib/types";

export function MatchCard({
  match,
  puuid,
  version,
}: {
  match: MatchDTO;
  puuid: string;
  version: string;
}) {
  const [open, setOpen] = useState(false);
  const me = match.info.participants.find((p) => p.puuid === puuid);
  if (!me) return null;

  const win = me.win;
  const totalCs = me.totalMinionsKilled + (me.neutralMinionsKilled ?? 0);
  const cspm = (totalCs / (match.info.gameDuration / 60)).toFixed(1);
  const items = [me.item0, me.item1, me.item2, me.item3, me.item4, me.item5];
  const teams = [
    match.info.participants.filter((p) => p.teamId === 100),
    match.info.participants.filter((p) => p.teamId === 200),
  ];

  return (
    <div
      className={cn(
        "rounded-xl border overflow-hidden transition-all animate-fade-in",
        win
          ? "border-win/30 bg-win/5 hover:bg-win/10"
          : "border-loss/30 bg-loss/5 hover:bg-loss/10"
      )}
    >
      <div className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[160px_auto_1fr_auto] gap-3 p-4 items-center">
        <div className="flex flex-col gap-1 min-w-0">
          <div
            className={cn(
              "text-sm font-bold",
              win ? "text-win" : "text-loss"
            )}
          >
            {queueName(match.info.queueId)}
          </div>
          <div className="text-xs text-muted-foreground">
            {timeAgo(match.info.gameCreation)}
          </div>
          <div className="text-xs text-muted-foreground">
            <span className={cn("font-semibold", win ? "text-win" : "text-loss")}>
              {win ? "Victory" : "Defeat"}
            </span>
            {" · "}
            {formatDuration(match.info.gameDuration)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Image
              src={championSquareUrl(me.championName, version)}
              alt={me.championName}
              width={56}
              height={56}
              unoptimized
              className="rounded-lg"
            />
            <span className="absolute -bottom-1 -right-1 bg-background border border-border text-[10px] px-1 rounded-full font-bold">
              {me.champLevel}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Image
              src={summonerSpellIconUrl(me.summoner1Id, version)}
              alt="spell"
              width={24}
              height={24}
              unoptimized
              className="rounded"
            />
            <Image
              src={summonerSpellIconUrl(me.summoner2Id, version)}
              alt="spell"
              width={24}
              height={24}
              unoptimized
              className="rounded"
            />
          </div>
        </div>

        <div className="hidden sm:flex flex-col gap-1">
          <div className="text-base font-bold">
            {me.kills} <span className="text-muted-foreground">/</span>{" "}
            <span className="text-loss">{me.deaths}</span>{" "}
            <span className="text-muted-foreground">/</span> {me.assists}
          </div>
          <div className="text-xs text-muted-foreground">
            {kdaRatio(me.kills, me.deaths, me.assists)} KDA
          </div>
          <div className="text-xs text-muted-foreground">
            {totalCs} CS ({cspm}/m) · {me.visionScore} vis
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="grid grid-cols-3 sm:grid-cols-7 gap-1">
            {items.map((id, i) => {
              const url = itemIconUrl(id, version);
              return (
                <div
                  key={i}
                  className="h-7 w-7 rounded-md bg-secondary/80 overflow-hidden"
                >
                  {url && (
                    <Image
                      src={url}
                      alt={`item-${id}`}
                      width={28}
                      height={28}
                      unoptimized
                    />
                  )}
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            className="p-2 rounded-md hover:bg-secondary/60 transition-colors"
            aria-label="Toggle details"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                open && "rotate-180"
              )}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/40 bg-background/40 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {teams.map((team, ti) => (
            <div key={ti} className="space-y-1">
              <div
                className={cn(
                  "text-xs font-bold uppercase tracking-wider mb-1",
                  ti === 0 ? "text-win" : "text-loss"
                )}
              >
                {ti === 0 ? "Blue Team" : "Red Team"}
              </div>
              {team.map((p) => (
                <div
                  key={p.puuid}
                  className={cn(
                    "flex items-center gap-2 text-xs rounded px-1 py-0.5",
                    p.puuid === puuid && "bg-primary/10"
                  )}
                >
                  <Image
                    src={championSquareUrl(p.championName, version)}
                    alt={p.championName}
                    width={20}
                    height={20}
                    unoptimized
                    className="rounded"
                  />
                  <span className="truncate flex-1 text-muted-foreground">
                    {p.riotIdGameName ?? p.summonerName}
                  </span>
                  <span className="font-mono">
                    {p.kills}/{p.deaths}/{p.assists}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
