"use server";
import { deleteRow, saveRow } from "@/features/admin/crud";
import { articleSchema } from "@/features/news/schema";
import { TAGS } from "@/lib/cache-tags";
import type { ActionState } from "@/types";

export async function saveArticle(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return saveRow({
    table: "articles",
    schema: articleSchema,
    formData,
    id,
    tags: (row) => [TAGS.articles, TAGS.article(row.slug)],
    redirectTo: () => "/admin/news?saved=1",
  });
}

export async function deleteArticle(id: string, slug: string): Promise<ActionState> {
  return deleteRow({ table: "articles", id, tags: [TAGS.articles, TAGS.article(slug)] });
}
