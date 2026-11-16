import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getPublicClient } from "@/lib/supabase/public";
import { TAGS } from "@/lib/cache-tags";
import { seed } from "@/lib/seed/data";
import type { TeamMemberRow } from "@/types";

export interface TeamAbout {
  heading: string;
  body: string;
  stats: { label: string; value: string }[];
}

export async function getTeamMembers(): Promise<TeamMemberRow[]> {
  "use cache";
  cacheLife("content");
  cacheTag(TAGS.team);
  const db = getPublicClient();
  if (!db) return seed.teamMembers.filter((m) => m.is_active).sort((a, b) => a.sort_order - b.sort_order);
  const { data, error } = await db.from("team_members").select("*").eq("is_active", true).order("sort_order");
  if (error) throw new Error(`getTeamMembers: ${error.message}`);
  return data;
}

export async function getTeamAbout(): Promise<TeamAbout> {
  "use cache";
  cacheLife("content");
  cacheTag(TAGS.settings);
  const fallback = seed.siteSettings.find((s) => s.key === "team_about")!.value as unknown as TeamAbout;
  const db = getPublicClient();
  if (!db) return fallback;
  const { data } = await db.from("site_settings").select("value").eq("key", "team_about").maybeSingle();
  return (data?.value as unknown as TeamAbout | undefined) ?? fallback;
}
