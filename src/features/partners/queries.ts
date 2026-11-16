import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getPublicClient } from "@/lib/supabase/public";
import { TAGS } from "@/lib/cache-tags";
import { seed } from "@/lib/seed/data";
import type { Partner, PartnerTier } from "@/types";

export async function getPartners(): Promise<Partner[]> {
  "use cache";
  cacheLife("content");
  cacheTag(TAGS.partners);
  const db = getPublicClient();
  if (!db) return seed.partners.filter((p) => p.is_active).sort((a, b) => a.sort_order - b.sort_order);
  const { data, error } = await db.from("partners").select("*").eq("is_active", true).order("sort_order");
  if (error) throw new Error(`getPartners: ${error.message}`);
  return data;
}

export const TIER_ORDER: PartnerTier[] = ["title", "principal", "official", "supplier"];

export async function getPartnersByTier(): Promise<Record<PartnerTier, Partner[]>> {
  const partners = await getPartners();
  const grouped = { title: [], principal: [], official: [], supplier: [] } as Record<PartnerTier, Partner[]>;
  for (const p of partners) grouped[p.tier].push(p);
  return grouped;
}
