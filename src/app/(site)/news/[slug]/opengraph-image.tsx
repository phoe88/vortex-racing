import { getArticleBySlug } from "@/features/news/queries";
import { renderOgCard, OG_SIZE } from "@/lib/og";
import { CATEGORY_LABEL } from "@/components/ui/badge";

export const alt = "Article";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  return renderOgCard({
    eyebrow: article ? CATEGORY_LABEL[article.category] : "News",
    title: article?.title ?? "Story not found",
    subtitle: article?.excerpt,
    image: article?.cover_image_url,
  });
}
