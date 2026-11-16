import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getPublicClient } from "@/lib/supabase/public";
import { TAGS } from "@/lib/cache-tags";
import { seed } from "@/lib/seed/data";
import type { Driver } from "@/types";

export async function getDrivers(): Promise<Driver[]> {
  "use cache";
  cacheLife("content");
  cacheTag(TAGS.drivers);
  const db = getPublicClient();
  if (!db) return seed.drivers.filter((d) => d.is_active).sort((a, b) => a.sort_order - b.sort_order);
  const { data, error } = await db
    .from("drivers")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`getDrivers: ${error.message}`);
  return data;
}

export async function getDriverBySlug(slug: string): Promise<Driver | null> {
  "use cache";
  cacheLife("content");
  cacheTag(TAGS.drivers, TAGS.driver(slug));
  const db = getPublicClient();
  if (!db) return seed.drivers.find((d) => d.slug === slug && d.is_active) ?? null;
  const { data, error } = await db.from("drivers").select("*").eq("slug", slug).eq("is_active", true).maybeSingle();
  if (error) throw new Error(`getDriverBySlug: ${error.message}`);
  return data;
}

export async function getDriverSlugs(): Promise<string[]> {
  return (await getDrivers()).map((d) => d.slug);
}
