import { z } from "zod";
import { f } from "@/lib/forms";
import { slugify } from "@/lib/utils";

export const articleSchema = z
  .object({
    title: f.text(200),
    slug: f.optText(120),
    excerpt: f.textDefault(600),
    body: f.textDefault(100_000),
    category: f.enumOf(["news", "race-report", "feature", "video", "partner", "team"]),
    cover_image_url: f.image(),
    video_url: f.url(),
    author_name: f.textDefault(120),
    tags: f.tags(),
    is_featured: f.bool(),
    status: f.enumOf(["draft", "published"]),
    published_at: f.datetime(),
  })
  .transform((d) => ({
    ...d,
    slug: d.slug ? slugify(d.slug) : slugify(d.title),
    author_name: d.author_name || "Vortex Racing Media",
    published_at: d.status === "published" ? (d.published_at ?? new Date().toISOString()) : d.published_at,
  }));
