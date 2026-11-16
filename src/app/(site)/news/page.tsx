import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { countArticles, getArticles } from "@/features/news/queries";
import { ArticleCard } from "@/components/shared/article-card";
import { Pagination } from "@/components/shared/pagination";
import { PageHero } from "@/components/shared/page-hero";
import { CardGridSkeleton } from "@/components/ui/skeleton";
import { ARTICLE_CATEGORIES, type ArticleCategory } from "@/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "News",
  description: "Breaking news, race reports, features and videos from the team.",
  alternates: { canonical: "/news" },
};

const PAGE_SIZE = 9;
const VALID = new Set(ARTICLE_CATEGORIES.map((c) => c.value));

export default function NewsPage({ searchParams }: PageProps<"/news">) {
  return (
    <>
      <PageHero eyebrow="Newsroom" title="News & stories" description="Race reports, technical features, team announcements and videos from inside the garage." />
      <div className="container-x pb-16">
        <Suspense fallback={<CardGridSkeleton count={6} />}>
          <NewsList searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}

async function NewsList({ searchParams }: { searchParams: PageProps<"/news">["searchParams"] }) {
  const sp = await searchParams;
  const raw = typeof sp.category === "string" ? sp.category : null;
  const category = raw && VALID.has(raw as ArticleCategory) ? (raw as ArticleCategory) : null;
  const page = Math.max(1, Number(typeof sp.page === "string" ? sp.page : 1) || 1);

  const [articles, total] = await Promise.all([
    getArticles({ category, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }),
    countArticles(category),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const makeHref = (p: number) => `/news?${new URLSearchParams({ ...(category ? { category } : {}), ...(p > 1 ? { page: String(p) } : {}) }).toString()}`.replace(/\?$/, "");

  return (
    <>
      <nav aria-label="Categories" className="mb-10 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[{ value: null, label: "All" }, ...ARTICLE_CATEGORIES].map((c) => {
          const active = c.value === category;
          return (
            <Link
              key={c.label}
              href={c.value ? `/news?category=${c.value}` : "/news"}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 font-display text-sm font-semibold uppercase tracking-[0.12em] transition",
                active ? "border-accent bg-accent text-white" : "border-white/15 text-ice/80 hover:border-white/40",
              )}
            >
              {c.label}
            </Link>
          );
        })}
      </nav>
      {articles.length === 0 ? (
        <p className="py-20 text-center text-muted">No stories in this category yet.</p>
      ) : (
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <ArticleCard key={a.id} article={a} variant={i === 0 && page === 1 ? "overlay" : "default"} className={i === 0 && page === 1 ? "sm:col-span-2 lg:col-span-3 lg:aspect-[21/9]" : undefined} />
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} makeHref={makeHref} />
    </>
  );
}
