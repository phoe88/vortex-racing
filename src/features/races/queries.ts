import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getPublicClient } from "@/lib/supabase/public";
import { TAGS } from "@/lib/cache-tags";
import { seed } from "@/lib/seed/data";
import { siteConfig } from "@/config/site";
import type { Race, RaceResult, RaceWithResults } from "@/types";

export async function getRaces(season: number = siteConfig.season): Promise<Race[]> {
  "use cache";
  cacheLife("content");
  cacheTag(TAGS.races);
  const db = getPublicClient();
  if (!db) return seed.races.filter((r) => r.season === season).sort((a, b) => a.round - b.round);
  const { data, error } = await db.from("races").select("*").eq("season", season).order("round");
  if (error) throw new Error(`getRaces: ${error.message}`);
  return data as Race[];
}

/** The next race that hasn't finished yet (or the live one). Short cache life. */
export async function getNextRace(season: number = siteConfig.season): Promise<Race | null> {
  "use cache";
  cacheLife("live");
  cacheTag(TAGS.races);
  const races = await getRaces(season);
  const now = Date.now();
  const live = races.find((r) => r.status === "live");
  if (live) return live;
  return (
    races.find((r) => r.status === "upcoming" && new Date(r.race_start).getTime() + 3 * 3600_000 > now) ??
    races.find((r) => r.status === "upcoming") ??
    null
  );
}

export async function getLastCompletedRace(season: number = siteConfig.season): Promise<RaceWithResults | null> {
  "use cache";
  cacheLife("live");
  cacheTag(TAGS.races);
  const races = await getRaces(season);
  const last = [...races].reverse().find((r) => r.status === "completed");
  if (!last) return null;
  return { ...last, results: await getRaceResults(last.id) };
}

export async function getRaceBySlug(slug: string): Promise<RaceWithResults | null> {
  "use cache";
  cacheLife("content");
  cacheTag(TAGS.races, TAGS.race(slug));
  const db = getPublicClient();
  if (!db) {
    const race = seed.races.find((r) => r.slug === slug);
    if (!race) return null;
    return { ...race, results: await getRaceResults(race.id) };
  }
  const { data, error } = await db.from("races").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`getRaceBySlug: ${error.message}`);
  if (!data) return null;
  return { ...(data as Race), results: await getRaceResults(data.id) };
}

export async function getRaceResults(raceId: string): Promise<RaceResult[]> {
  "use cache";
  cacheLife("content");
  cacheTag(TAGS.races);
  const db = getPublicClient();
  if (!db) {
    return seed.raceResults
      .filter((r) => r.race_id === raceId)
      .sort((a, b) => (a.position ?? 99) - (b.position ?? 99));
  }
  const { data, error } = await db
    .from("race_results")
    .select("*")
    .eq("race_id", raceId)
    .order("position", { ascending: true, nullsFirst: false });
  if (error) throw new Error(`getRaceResults: ${error.message}`);
  return data;
}

export async function getRaceSlugs(): Promise<string[]> {
  return (await getRaces()).map((r) => r.slug);
}
