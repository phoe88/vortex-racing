import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { getArticleBySlug, getArticleSlugs, getArticles } from "@/features/news/queries";
import { ArticleCard } from "@/components/shared/article-card";
import { CategoryLozenge } from "@/components/shared/category-lozenge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
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
    <article className="pt-6 sm:pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="container-x max-w-4xl">
        <Breadcrumbs items={[{ label: "News", href: "/news" }, { label: article.title }]} />
        <div className="type-body-small mt-4 flex flex-wrap items-center gap-2 text-subtlest">
          <CategoryLozenge category={article.category} />
          <time dateTime={article.published_at ?? undefined}>{formatDate(article.published_at)}</time>
          <span className="inline-flex items-center gap-1"><Clock className="size-3" aria-hidden /> {readingTime(article.body)} min read</span>
        </div>
        <h1 className="type-heading-xlarge sm:type-heading-xxlarge mt-2 text-balance">{article.title}</h1>
        <p className="type-body-large mt-2 text-subtle">{article.excerpt}</p>
        <p className="type-body-small mt-2 text-subtlest">By {article.author_name}</p>
      </header>

      <div className="container-x mt-6 max-w-6xl">
        {embed ? (
          <div className="aspect-video overflow-hidden rounded-xl bg-neutral">
            <iframe src={embed} title={article.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="size-full" loading="lazy" />
          </div>
        ) : article.cover_image_url ? (
          <div className="relative aspect-[21/10] overflow-hidden rounded-xl bg-neutral">
            <Image src={article.cover_image_url} alt="" fill priority sizes="(min-width: 1280px) 1152px, 100vw" className="object-cover" />
          </div>
        ) : null}
      </div>

      <div className="container-x mt-8 grid max-w-6xl gap-8 lg:grid-cols-[1fr_18rem]">
        <div className="prose-ads max-w-3xl" dangerouslySetInnerHTML={{ __html: renderMarkdown(article.body) }} />
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          {article.tags.length > 0 && (
            <div>
              <p className="type-heading-xxsmall mb-2 text-subtlest">Tags</p>
              <div className="flex flex-wrap gap-1">
                {article.tags.map((t) => (
                  <span key={t} className="inline-flex h-5 items-center rounded-sm border px-1 text-sm text-default">{t}</span>
                ))}
              </div>
            </div>
          )}
          <div className="card p-4">
            <h2 className="type-heading-small">Paddock Pass</h2>
            <p className="mt-1 text-sm text-subtle">Get stories like this one in your inbox every race week.</p>
            <ButtonLink href="/newsletter" appearance="primary" className="mt-3">Subscribe</ButtonLink>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="container-x mt-12">
          <SectionHeading eyebrow="Keep reading" title="Related stories" href="/news" />
          <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>
        </section>
      )}
    </article>
  );
}
