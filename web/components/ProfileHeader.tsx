import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { profileIconUrl } from "@/lib/ddragon";
import { PLATFORM_LABELS } from "@/lib/regions";
import type { ProfilePayload } from "@/lib/types";

export function ProfileHeader({
  profile,
  version,
}: {
  profile: ProfilePayload;
  version: string;
}) {
  const { account, summoner, platform } = profile;
  return (
    <Card className="overflow-hidden animate-fade-in">
      <div className="h-24 bg-gradient-to-r from-primary/40 via-purple-500/20 to-transparent" />
      <CardContent className="pt-0 -mt-12 flex flex-col sm:flex-row items-start sm:items-end gap-4">
        <div className="relative">
          <Image
            src={profileIconUrl(summoner.profileIconId, version)}
            alt="Profile icon"
            width={96}
            height={96}
            unoptimized
            className="rounded-2xl border-4 border-background shadow-xl"
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
            {summoner.summonerLevel}
          </div>
        </div>
        <div className="flex-1 min-w-0 mt-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {account.gameName}
            </h1>
            <span className="text-xl text-muted-foreground">
              #{account.tagLine}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Badge className="bg-primary/15 border-primary/30 text-primary">
              {PLATFORM_LABELS[platform] ?? platform.toUpperCase()}
            </Badge>
            <Badge>Level {summoner.summonerLevel}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
