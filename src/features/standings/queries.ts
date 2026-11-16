import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getPublicClient } from "@/lib/supabase/public";
import { TAGS } from "@/lib/cache-tags";
import { seed } from "@/lib/seed/data";
import { siteConfig } from "@/config/site";
import type { ConstructorStanding, DriverStanding } from "@/types";

export async function getDriverStandings(season = siteConfig.season): Promise<DriverStanding[]> {
  "use cache";
  cacheLife("live");
  cacheTag(TAGS.standings);
  const db = getPublicClient();
  if (!db) return seed.driverStandings.filter((s) => s.season === season).sort((a, b) => a.position - b.position);
  const { data, error } = await db.from("driver_standings").select("*").eq("season", season).order("position");
  if (error) throw new Error(`getDriverStandings: ${error.message}`);
  return data;
}

export async function getConstructorStandings(season = siteConfig.season): Promise<ConstructorStanding[]> {
  "use cache";
  cacheLife("live");
  cacheTag(TAGS.standings);
  const db = getPublicClient();
  if (!db) return seed.constructorStandings.filter((s) => s.season === season).sort((a, b) => a.position - b.position);
  const { data, error } = await db.from("constructor_standings").select("*").eq("season", season).order("position");
  if (error) throw new Error(`getConstructorStandings: ${error.message}`);
  return data;
}

/** Compact championship snapshot for the home page. */
export async function getChampionshipSnapshot(season = siteConfig.season) {
  "use cache";
  cacheLife("live");
  cacheTag(TAGS.standings);
  const [drivers, constructors] = await Promise.all([
    getDriverStandings(season),
    getConstructorStandings(season),
  ]);
  return {
    teamDrivers: drivers.filter((d) => d.is_team),
    teamConstructor: constructors.find((c) => c.is_team) ?? null,
    leaderDriver: drivers[0] ?? null,
    leaderConstructor: constructors[0] ?? null,
    topDrivers: drivers.slice(0, 5),
    topConstructors: constructors.slice(0, 5),
  };
}
