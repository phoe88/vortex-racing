import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getPublicClient } from "@/lib/supabase/public";
import { TAGS } from "@/lib/cache-tags";
import { seed } from "@/lib/seed/data";
import type { Article, ArticleCategory } from "@/types";

const demoPublished = () =>
  seed.articles
    .filter((a) => a.status === "published")
    .sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));

export interface ArticleListOptions {
  category?: ArticleCategory | null;
  limit?: number;
  offset?: number;
  excludeId?: string | null;
  tag?: string | null;
}

export async function getArticles(opts: ArticleListOptions = {}): Promise<Article[]> {
  "use cache";
  cacheLife("content");
  cacheTag(TAGS.articles);
  const { category = null, limit = 12, offset = 0, excludeId = null, tag = null } = opts;

  const db = getPublicClient();
  if (!db) {
    return demoPublished()
      .filter((a) => !category || a.category === category)
      .filter((a) => !tag || a.tags.includes(tag))
      .filter((a) => a.id !== excludeId)
      .slice(offset, offset + limit);
  }

  let q = db
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (category) q = q.eq("category", category);
  if (tag) q = q.contains("tags", [tag]);
  if (excludeId) q = q.neq("id", excludeId);
  const { data, error } = await q;
  if (error) throw new Error(`getArticles: ${error.message}`);
  return data;
}

export async function countArticles(category: ArticleCategory | null = null): Promise<number> {
  "use cache";
  cacheLife("content");
  cacheTag(TAGS.articles);
  const db = getPublicClient();
  if (!db) return demoPublished().filter((a) => !category || a.category === category).length;
  let q = db.from("articles").select("id", { count: "exact", head: true }).eq("status", "published");
  if (category) q = q.eq("category", category);
  const { count, error } = await q;
  if (error) throw new Error(`countArticles: ${error.message}`);
  return count ?? 0;
}

export async function getFeaturedArticle(): Promise<Article | null> {
  "use cache";
  cacheLife("content");
  cacheTag(TAGS.articles);
  const db = getPublicClient();
  if (!db) return demoPublished().find((a) => a.is_featured) ?? demoPublished()[0] ?? null;
  const { data, error } = await db
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("is_featured", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`getFeaturedArticle: ${error.message}`);
  return data;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  "use cache";
  cacheLife("content");
  cacheTag(TAGS.articles, TAGS.article(slug));
  const db = getPublicClient();
  if (!db) return demoPublished().find((a) => a.slug === slug) ?? null;
  const { data, error } = await db
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw new Error(`getArticleBySlug: ${error.message}`);
  return data;
}

export async function getArticleSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("content");
  cacheTag(TAGS.articles);
  const db = getPublicClient();
  if (!db) return demoPublished().map((a) => a.slug);
  const { data } = await db.from("articles").select("slug").eq("status", "published").limit(500);
  return (data ?? []).map((r) => r.slug);
}
