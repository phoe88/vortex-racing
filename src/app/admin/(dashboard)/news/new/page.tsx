import { AdminPageHeader } from "@/features/admin/components/page-header";
import { ArticleForm } from "@/features/news/components/article-form";

export const metadata = { title: "New article" };

export default function NewArticlePage() {
  return (
    <>
      <AdminPageHeader title="New article" backHref="/admin/news" />
      <ArticleForm />
    </>
  );
}
