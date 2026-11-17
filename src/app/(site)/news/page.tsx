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
      <PageHero title="Latest News" description="Race reports, technical features, team announcements and videos from inside the garage." />
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
  const [lead, ...others] = articles;

  return (
    <>
      <nav aria-label="Categories" className="scrollbar-none -mx-4 mb-10 flex gap-2 overflow-x-auto px-4">
        {[{ value: null, label: "All" }, ...ARTICLE_CATEGORIES].map((c) => {
          const active = c.value === category;
          return (
            <Link
              key={c.label}
              href={c.value ? `/news?category=${c.value}` : "/news"}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex h-10 shrink-0 items-center rounded-full px-4 text-sm font-medium transition-colors",
                active ? "bg-neutral-bold text-inverse" : "bg-neutral hover:bg-neutral-hovered",
              )}
            >
              {c.label}
            </Link>
          );
        })}
      </nav>
      {articles.length === 0 ? (
        <p className="py-20 text-center text-subtle">No stories in this category yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {page === 1 && lead ? (
            <ArticleCard article={lead} variant="hero" priority className="min-h-[30rem] sm:col-span-2 lg:col-span-3 lg:min-h-[34rem]" />
          ) : lead ? (
            <ArticleCard article={lead} />
          ) : null}
          {others.map((a) => <ArticleCard key={a.id} article={a} />)}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} makeHref={makeHref} />
    </>
  );
}
