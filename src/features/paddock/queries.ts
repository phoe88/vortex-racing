import "server-only";
import { getArticles } from "@/features/news/queries";
import type { Perk } from "@/features/paddock/content";
import type { Article } from "@/types";

const LIMIT = 8;

/**
 * Stories for a benefit page: articles matching its tags and categories first
 * (newest first), topped up with the latest news so the rail is never sparse.
 */
export async function getPerkStories(perk: Perk): Promise<Article[]> {
  const { tags = [], categories = [] } = perk.stories;
  const groups = await Promise.all([
    ...tags.map((tag) => getArticles({ tag, limit: LIMIT })),
    ...categories.map((category) => getArticles({ category, limit: LIMIT })),
  ]);
  const byTime = (a: Article, b: Article) => (b.published_at ?? "").localeCompare(a.published_at ?? "");
  const seen = new Set<string>();
  const out: Article[] = [];
  for (const a of groups.flat().sort(byTime)) {
    if (!seen.has(a.id)) { seen.add(a.id); out.push(a); }
  }
  if (out.length < 4) {
    for (const a of await getArticles({ limit: LIMIT })) {
      if (out.length >= LIMIT) break;
      if (!seen.has(a.id)) { seen.add(a.id); out.push(a); }
    }
  }
  return out.slice(0, LIMIT);
}
