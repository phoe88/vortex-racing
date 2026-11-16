import { EntityForm, type FormSection } from "@/features/admin/components/entity-form";
import { saveArticle } from "@/actions/articles";
import { ARTICLE_CATEGORIES, type Article } from "@/types";

const sections: FormSection[] = [
  {
    title: "Story",
    fields: [
      { name: "title", label: "Title", required: true, span: 2 },
      { name: "slug", label: "Slug", hint: "Leave blank to generate from the title." },
      { name: "category", label: "Category", type: "select", options: ARTICLE_CATEGORIES },
      { name: "excerpt", label: "Excerpt", type: "textarea", rows: 3, hint: "Shown on cards and in search results (max 600 characters)." },
      { name: "body", label: "Body (Markdown)", type: "markdown", hint: "Headings (##), **bold**, lists, > quotes, links and images are supported." },
    ],
  },
  {
    title: "Media",
    fields: [
      { name: "cover_image_url", label: "Cover image", type: "image", folder: "articles" },
      { name: "video_url", label: "Video URL", type: "url", hint: "YouTube or Vimeo link. Replaces the cover image on the article page.", span: 2 },
    ],
  },
  {
    title: "Publishing",
    fields: [
      { name: "status", label: "Status", type: "select", options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }] },
      { name: "published_at", label: "Publish date (UTC)", type: "datetime", hint: "Blank = now, when published." },
      { name: "author_name", label: "Author" },
      { name: "tags", label: "Tags", type: "tags", hint: "Comma separated. Driver full names link stories to profiles." },
      { name: "is_featured", label: "Feature on the home page hero", type: "checkbox" },
    ],
  },
];

export function ArticleForm({ article }: { article?: Article | null }) {
  return (
    <EntityForm
      action={saveArticle.bind(null, article?.id ?? null)}
      sections={sections}
      initial={article ?? { status: "draft", category: "news", author_name: "Vortex Racing Media" }}
      cancelHref="/admin/news"
      submitLabel={article ? "Save changes" : "Create article"}
    />
  );
}
