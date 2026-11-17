import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticleSlugs, getArticles } from "@/features/news/queries";
import { ArticleCard } from "@/components/shared/article-card";
import { CategoryLozenge } from "@/components/shared/category-lozenge";
import { Carousel } from "@/components/ui/carousel";
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
  const related = await getArticles({ limit: 8, excludeId: article.id });
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

  const published = article.published_at
    ? formatDate(article.published_at, { day: "2-digit", month: "2-digit", year: "numeric" })
    : null;

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Full-bleed lead image with the headline over its lower edge */}
      <header className="relative isolate flex min-h-[78vh] flex-col justify-end overflow-hidden pb-12 pt-40 sm:pb-16">
        {article.cover_image_url && <Image src={article.cover_image_url} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />}
        <div className="media-scrim-soft absolute inset-0 -z-10" />
        <div className="container-x grid gap-6 lg:grid-cols-[12rem_minmax(0,46rem)]">
          <div className="lg:pt-3"><CategoryLozenge category={article.category} /></div>
          <h1 className="type-heading-xxlarge text-balance">{article.title}</h1>
        </div>
      </header>

      <div className="container-x grid gap-6 lg:grid-cols-[12rem_minmax(0,46rem)]">
        <div className="hidden lg:block" />
        <div>
          <p className="type-body-large">{article.excerpt}</p>
          <div className="mt-8 border-b pb-8">
            <p className="type-body-small font-medium">Written by {article.author_name}</p>
            <p className="type-body-small mt-1 text-subtle">
              {readingTime(article.body)} min read{published && <> · Published on <time dateTime={article.published_at ?? undefined}>{published}</time></>}
            </p>
          </div>

          {embed && (
            <div className="mt-10 aspect-video overflow-hidden rounded-xl bg-navy-raised">
              <iframe src={embed} title={article.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="size-full" loading="lazy" />
            </div>
          )}

          <div className="prose-site mt-10" dangerouslySetInnerHTML={{ __html: renderMarkdown(article.body) }} />

          {article.tags.length > 0 && (
            <ul className="mt-12 flex flex-wrap gap-2" aria-label="Tags">
              {article.tags.map((t) => (
                <li key={t} className="inline-flex h-8 items-center rounded-full bg-neutral px-3.5 text-sm">{t}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <Carousel title="More Stories" className="mt-24 sm:mt-32">
          {related.map((a, i) => <ArticleCard key={a.id} article={a} number={i + 1} />)}
        </Carousel>
      )}
    </article>
  );
}
