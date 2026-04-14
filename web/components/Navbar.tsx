import Link from "next/link";
import { Swords } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-b border-border/50 backdrop-blur-md bg-background/60 sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary to-purple-500 text-primary-foreground">
            <Swords className="h-5 w-5" />
          </span>
          <span>
            LoL<span className="text-primary">.tracker</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Search
          </Link>
          <a
            href="https://developer.riotgames.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Riot API
          </a>
        </nav>
      </div>
    </header>
  );
}
