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
      <div className="container-x">
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
      {/* Category tabs */}
      <nav aria-label="Categories" className="scrollbar-none mb-6 flex gap-1 overflow-x-auto border-b-2">
        {[{ value: null, label: "All" }, ...ARTICLE_CATEGORIES].map((c) => {
          const active = c.value === category;
          return (
            <Link
              key={c.label}
              href={c.value ? `/news?category=${c.value}` : "/news"}
              aria-current={active ? "page" : undefined}
              className={cn(
                "-mb-0.5 shrink-0 border-b-2 px-2 py-2 text-sm font-medium transition-colors -outline-offset-2",
                active ? "border-selected text-selected" : "border-transparent text-subtle hover:border-bold hover:text-default",
              )}
            >
              {c.label}
            </Link>
          );
        })}
      </nav>
      {articles.length === 0 ? (
        <p className="py-16 text-center text-sm text-subtle">No stories in this category yet.</p>
      ) : (
        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <ArticleCard key={a.id} article={a} variant={i === 0 && page === 1 ? "hero" : "default"} priority={i === 0 && page === 1} className={i === 0 && page === 1 ? "sm:col-span-2 lg:col-span-3" : undefined} />
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} makeHref={makeHref} />
    </>
  );
}
