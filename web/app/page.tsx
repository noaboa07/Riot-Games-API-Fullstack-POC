import { SearchBar } from "@/components/SearchBar";
import { RecentSearches } from "@/components/RecentSearches";
import { Sparkles, Swords, TrendingUp, Radio } from "lucide-react";

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto pt-12 sm:pt-20">
      <div className="text-center mb-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground mb-4">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Powered by the Riot Games API
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
          Track your Rift.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Search any Riot ID to view ranked stats, match history, and live games.
        </p>
      </div>

      <SearchBar />
      <RecentSearches />

      <div className="mt-16 grid sm:grid-cols-3 gap-4">
        <Feature
          icon={<Swords className="h-5 w-5" />}
          title="Match History"
          desc="Detailed KDA, CS, vision, items and per-team breakdowns."
        />
        <Feature
          icon={<TrendingUp className="h-5 w-5" />}
          title="Ranked Profile"
          desc="Solo/Duo and Flex tiers, win rates and LP at a glance."
        />
        <Feature
          icon={<Radio className="h-5 w-5" />}
          title="Live Game"
          desc="Auto-detects when a player is currently in a game."
        />
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-5 hover:border-primary/50 transition-colors">
      <div className="h-9 w-9 grid place-items-center rounded-lg bg-primary/15 text-primary">
        {icon}
      </div>
      <div className="mt-3 font-semibold">{title}</div>
      <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
    </div>
  );
}
