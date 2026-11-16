import { notFound } from "next/navigation";
import { adminGet } from "@/features/admin/queries";
import { DynamicRoute } from "@/components/shared/dynamic-route";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { ArticleForm } from "@/features/news/components/article-form";

export const metadata = { title: "Edit article" };

export default async function EditArticlePage({ params }: PageProps<"/admin/news/[id]">) {
  const { id } = await params;
  const article = await adminGet("articles", id);
  if (!article) notFound();
  return (
    <>
      <DynamicRoute />
      <AdminPageHeader title={article.title} description={`Last updated ${new Date(article.updated_at).toLocaleString("en-GB")}`} backHref="/admin/news" />
      <ArticleForm article={article} />
    </>
  );
}
