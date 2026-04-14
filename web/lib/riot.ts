import { regionalFor } from "./regions";

const KEY = process.env.RIOT_API_KEY;

export class RiotError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function riotFetch(url: string, revalidate = 60) {
  if (!KEY) {
    throw new RiotError(500, "RIOT_API_KEY is not configured on the server.");
  }
  const res = await fetch(url, {
    headers: { "X-Riot-Token": KEY },
    next: { revalidate },
  });
  if (!res.ok) {
    if (res.status === 404) throw new RiotError(404, "Summoner not found.");
    if (res.status === 429) throw new RiotError(429, "Riot API rate limit hit. Try again in a moment.");
    if (res.status === 401 || res.status === 403)
      throw new RiotError(res.status, "Invalid or expired Riot API key.");
    throw new RiotError(res.status, `Riot API error (${res.status}).`);
  }
  return res.json();
}

export async function getAccountByRiotId(name: string, tag: string, platform: string) {
  const regional = regionalFor(platform);
  return riotFetch(
    `https://${regional}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
      name
    )}/${encodeURIComponent(tag)}`,
    300
  );
}

export async function getSummonerByPuuid(puuid: string, platform: string) {
  return riotFetch(
    `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
    300
  );
}

export async function getRankedEntries(summonerId: string, platform: string) {
  return riotFetch(
    `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`,
    120
  );
}

export async function getMatchIds(puuid: string, platform: string, count = 10) {
  const regional = regionalFor(platform);
  return riotFetch(
    `https://${regional}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}`,
    60
  );
}

export async function getMatch(matchId: string, platform: string) {
  const regional = regionalFor(platform);
  return riotFetch(
    `https://${regional}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
    60 * 60 * 24
  );
}

export async function getActiveGame(puuid: string, platform: string) {
  try {
    return await riotFetch(
      `https://${platform}.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${puuid}`,
      30
    );
  } catch (e) {
    if (e instanceof RiotError && e.status === 404) return null;
    throw e;
  }
}
