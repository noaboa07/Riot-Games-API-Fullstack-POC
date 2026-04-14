"use client";

import Link from "next/link";
import { Clock, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRecentSearches } from "@/store/useRecentSearches";
import { PLATFORM_LABELS } from "@/lib/regions";

export function RecentSearches() {
  const recents = useRecentSearches((s) => s.recents);
  const remove = useRecentSearches((s) => s.remove);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || recents.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-3">
        <Clock className="h-3.5 w-3.5" />
        Recent Searches
      </div>
      <div className="flex flex-wrap gap-2">
        {recents.map((r) => (
          <div
            key={`${r.platform}-${r.gameName}-${r.tagLine}`}
            className="group flex items-center gap-2 rounded-full border border-border/60 bg-card/60 pl-3 pr-1 py-1 text-sm hover:border-primary/60 transition-colors"
          >
            <Link
              href={`/summoner/${r.platform}/${encodeURIComponent(r.gameName)}-${encodeURIComponent(r.tagLine)}`}
              className="flex items-center gap-2"
            >
              <span className="text-[10px] font-bold text-primary">
                {PLATFORM_LABELS[r.platform] ?? r.platform.toUpperCase()}
              </span>
              <span className="font-medium">{r.gameName}</span>
              <span className="text-muted-foreground">#{r.tagLine}</span>
            </Link>
            <button
              onClick={() => remove(r.gameName, r.tagLine)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-secondary"
              aria-label="Remove"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
