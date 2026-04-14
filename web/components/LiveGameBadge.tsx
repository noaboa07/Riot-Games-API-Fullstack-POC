"use client";

import { useQuery } from "@tanstack/react-query";
import { Radio } from "lucide-react";

export function LiveGameBadge({
  platform,
  puuid,
}: {
  platform: string;
  puuid: string;
}) {
  const { data } = useQuery({
    queryKey: ["live", platform, puuid],
    queryFn: async () => {
      const res = await fetch(`/api/live/${platform}/${puuid}`);
      if (!res.ok) return { game: null };
      return res.json();
    },
    refetchInterval: 60_000,
  });

  if (!data?.game) return null;

  return (
    <div className="flex items-center gap-2 rounded-full bg-loss/15 border border-loss/30 px-3 py-1.5 text-sm text-loss font-semibold animate-pulse">
      <Radio className="h-4 w-4" />
      In Game Now
    </div>
  );
}
