import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { getArticleBySlug, getArticleSlugs, getArticles } from "@/features/news/queries";
import { ArticleCard } from "@/components/shared/article-card";
import { Badge, CATEGORY_LABEL } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { renderMarkdown } from "@/lib/markdown";
import { formatDate, readingTime, toYouTubeEmbed } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Story not found" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/news/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.published_at ?? undefined,
      authors: [article.author_name],
      tags: article.tags,
    },
  };
}

export default async function ArticlePage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();
  const related = await getArticles({ category: article.category, limit: 3, excludeId: article.id });
  const embed = toYouTubeEmbed(article.video_url);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.cover_image_url ? [article.cover_image_url] : undefined,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: { "@type": "Organization", name: article.author_name },
    publisher: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <article className="pt-28 sm:pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="container-x max-w-4xl">
        <Link href="/news" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ice"><ArrowLeft className="size-4" /> All news</Link>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
          <Badge tone="accent">{CATEGORY_LABEL[article.category]}</Badge>
          <time dateTime={article.published_at ?? undefined}>{formatDate(article.published_at)}</time>
          <span className="inline-flex items-center gap-1"><Clock className="size-3.5" /> {readingTime(article.body)} min read</span>
        </div>
        <h1 className="display mt-5 text-4xl text-balance sm:text-5xl lg:text-6xl">{article.title}</h1>
        <p className="mt-5 text-lg text-ice/80 sm:text-xl">{article.excerpt}</p>
        <p className="mt-4 text-sm text-muted">By {article.author_name}</p>
      </header>

      <div className="container-x mt-10 max-w-6xl">
        {embed ? (
          <div className="aspect-video overflow-hidden rounded-2xl bg-black">
            <iframe src={embed} title={article.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="size-full" loading="lazy" />
          </div>
        ) : article.cover_image_url ? (
          <div className="relative aspect-[21/10] overflow-hidden rounded-2xl bg-navy-2">
            <Image src={article.cover_image_url} alt="" fill priority sizes="(min-width: 1280px) 1152px, 100vw" className="object-cover" />
          </div>
        ) : null}
      </div>

      <div className="container-x mt-12 grid max-w-6xl gap-12 lg:grid-cols-[1fr_18rem]">
        <div className="prose-racing max-w-3xl" dangerouslySetInnerHTML={{ __html: renderMarkdown(article.body) }} />
        <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
          {article.tags.length > 0 && (
            <div>
              <p className="eyebrow mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((t) => (
                  <span key={t} className="rounded-full border border-white/12 px-3 py-1 text-xs text-ice/80">{t}</span>
                ))}
              </div>
            </div>
          )}
          <div className="card p-5">
            <p className="eyebrow mb-2 text-accent-2">Paddock Pass</p>
            <p className="text-sm text-muted">Get stories like this one in your inbox every race week.</p>
            <Link href="/newsletter" className="mt-4 inline-flex h-10 items-center rounded-full bg-accent px-5 font-display text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#ff1a45]">Subscribe</Link>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="container-x mt-24">
          <SectionHeading eyebrow="Keep reading" title="Related stories" href="/news" />
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>
        </section>
      )}
    </article>
  );
}
