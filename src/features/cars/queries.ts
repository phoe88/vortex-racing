import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getPublicClient } from "@/lib/supabase/public";
import { TAGS } from "@/lib/cache-tags";
import { seed } from "@/lib/seed/data";
import type { Car } from "@/types";

export async function getCars(): Promise<Car[]> {
  "use cache";
  cacheLife("content");
  cacheTag(TAGS.cars);
  const db = getPublicClient();
  if (!db) return [...seed.cars].sort((a, b) => b.season - a.season);
  const { data, error } = await db.from("cars").select("*").order("season", { ascending: false });
  if (error) throw new Error(`getCars: ${error.message}`);
  return data as Car[];
}

export async function getCurrentCar(): Promise<Car | null> {
  const cars = await getCars();
  return cars.find((c) => c.is_current) ?? cars[0] ?? null;
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  "use cache";
  cacheLife("content");
  cacheTag(TAGS.cars, TAGS.car(slug));
  const db = getPublicClient();
  if (!db) return seed.cars.find((c) => c.slug === slug) ?? null;
  const { data, error } = await db.from("cars").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`getCarBySlug: ${error.message}`);
  return data as Car | null;
}

export async function getCarSlugs(): Promise<string[]> {
  return (await getCars()).map((c) => c.slug);
}
