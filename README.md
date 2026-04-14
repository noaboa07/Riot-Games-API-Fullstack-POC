# LoL.tracker

A modern, production-quality League of Legends stat tracker inspired by op.gg and deeplol.gg. Search any Riot ID, view ranked profile, recent match history, champion stats, and live game detection — all built on a clean Next.js 14 App Router stack.

![stack](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)
![ts](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)
![tailwind](https://img.shields.io/badge/TailwindCSS-3-38BDF8?logo=tailwindcss)
![rq](https://img.shields.io/badge/TanStack_Query-5-FF4154)
![riot](https://img.shields.io/badge/Riot_API-v5-D32936)

## Features

- **Riot ID search** — modern `GameName#TAG` lookup across 11 regions
- **Profile dashboard** — level, profile icon, Solo/Duo and Flex rank cards with tier emblems, LP, win rate
- **Match history** — expandable cards with KDA, CS/min, vision score, items, summoner spells, full team breakdown, color-coded win/loss
- **Champion stats** — most-played champions with average KDA and win rate
- **Live game detection** — auto-polls and surfaces a badge when the player is in an active game
- **Recent searches** — persisted to `localStorage` via Zustand
- **Production polish** — dark theme, gradient hero, animated skeletons, responsive mobile/desktop layout, smooth fade-ins
- **Smart caching** — Next.js fetch revalidation + a 12h in-memory cache for Data Dragon version metadata, React Query for client-side caching and background refetching
- **Graceful errors** — typed `RiotError` with friendly messages for 404 / 429 / 401 / 403

## Tech Stack

| Layer | Choice |
|------|--------|
| Framework | **Next.js 14** (App Router, RSC, Route Handlers) |
| Language | **TypeScript** (strict) |
| Styling | **Tailwind CSS** + custom dark theme tokens |
| Components | **shadcn/ui** primitives (Button, Card, Input, Tabs, Skeleton, Badge) on Radix |
| Data fetching | **TanStack Query v5** for client cache + background refetch |
| State | **Zustand** with `persist` middleware for recent searches |
| Icons | **lucide-react** |
| Static assets | **Riot Data Dragon** + **Community Dragon** CDNs |

## Project Structure

```
web/
├── app/
│   ├── api/
│   │   ├── profile/[platform]/[name]/[tag]/route.ts
│   │   ├── matches/[platform]/[puuid]/route.ts
│   │   ├── live/[platform]/[puuid]/route.ts
│   │   └── ddragon/version/route.ts
│   ├── summoner/[platform]/[riotId]/
│   │   ├── page.tsx          # RSC: profile + ranks
│   │   ├── MatchHistory.tsx  # client: React Query match list
│   │   └── not-found.tsx
│   ├── layout.tsx
│   ├── page.tsx              # landing + search
│   └── globals.css
├── components/
│   ├── ui/                   # shadcn primitives
│   ├── Navbar.tsx
│   ├── SearchBar.tsx
│   ├── ProfileHeader.tsx
│   ├── RankCard.tsx
│   ├── MatchCard.tsx
│   ├── ChampionStats.tsx
│   ├── LiveGameBadge.tsx
│   ├── RecentSearches.tsx
│   └── MatchHistorySkeleton.tsx
├── lib/
│   ├── riot.ts               # typed Riot API client
│   ├── ddragon.ts            # Data Dragon helpers + cached version
│   ├── regions.ts            # platform ↔ regional routing
│   ├── queues.ts
│   ├── types.ts
│   └── utils.ts
├── providers/QueryProvider.tsx
└── store/useRecentSearches.ts
```

## Getting Started

```bash
cd web
cp .env.local.example .env.local
# add your Riot API key to .env.local
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) and search a Riot ID like `Faker#KR1`.

### Environment

| Variable | Description |
|---------|-------------|
| `RIOT_API_KEY` | Your key from [developer.riotgames.com](https://developer.riotgames.com) |

## How It Works

1. The search bar parses `GameName#TAG`, picks a platform, and routes to `/summoner/[platform]/[name-tag]`.
2. The summoner page is a **React Server Component** that calls the Riot API directly through `lib/riot.ts` — account → summoner → ranked entries — so the initial paint already has profile data.
3. Match history hydrates client-side via **React Query**, hitting `/api/matches/[platform]/[puuid]`, which fans out match-detail fetches in parallel and is cached for 24h server-side.
4. The Live Game badge polls `/api/live/[platform]/[puuid]` every 60s through React Query.
5. Data Dragon version data is fetched once and cached in-memory for 12h, so champion / item / spell icons all resolve to the latest patch URLs without re-fetching.

## Rate Limit & Error Handling

Riot API errors are wrapped in a typed `RiotError` and surfaced to the UI with friendly copy:

- `404` → routed to a clean not-found page
- `429` → "Rate limit hit. Try again in a moment."
- `401 / 403` → "Invalid or expired Riot API key."

## Legacy

This project began in 2024 as a full-stack Riot Games API proof of concept (CRA + Express) — exploring secure API integration, asynchronous orchestration of multi-stage data fetches, payload optimization, and rate limit handling. That original prototype still lives under `client/` and `server/`. The rewrite under `web/` evolves it into a modern Next.js 14 App Router stack with the production-quality features above.

## License

MIT — see [LICENSE](./LICENSE). Not endorsed by Riot Games. League of Legends is a trademark of Riot Games, Inc.

---

**Noah Russell** — Master of Science in AI (May 2026)
[LinkedIn](https://www.linkedin.com/in/noah-russell-61103128a/) · [Email](mailto:noahrussell2004@gmail.com)
