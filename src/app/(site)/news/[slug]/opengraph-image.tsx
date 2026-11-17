import { getArticleBySlug } from "@/features/news/queries";
import { renderOgCard, OG_SIZE } from "@/lib/og";
import { categoryMeta } from "@/features/news/categories";

export const alt = "Article";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  return renderOgCard({
    eyebrow: article ? categoryMeta(article.category).label : "News",
    title: article?.title ?? "Story not found",
    subtitle: article?.excerpt,
    image: article?.cover_image_url,
  });
}
