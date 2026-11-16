import Image from "next/image";
import Link from "next/link";
import { Play, Clock } from "lucide-react";
import { Badge, CATEGORY_LABEL } from "@/components/ui/badge";
import { cn, formatDate, readingTime } from "@/lib/utils";
import type { Article } from "@/types";

type Variant = "default" | "overlay" | "hero" | "compact";

export function ArticleCard({
  article,
  variant = "default",
  priority = false,
  className,
}: {
  article: Article;
  variant?: Variant;
  priority?: boolean;
  className?: string;
}) {
  const href = `/news/${article.slug}`;
  const isVideo = article.category === "video" || !!article.video_url;
  const label = CATEGORY_LABEL[article.category] ?? article.category;

  if (variant === "compact") {
    return (
      <Link href={href} className={cn("group flex gap-4", className)}>
        <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-xl bg-navy-2">
          {article.cover_image_url && (
            <Image src={article.cover_image_url} alt="" fill sizes="112px" className="object-cover transition duration-500 group-hover:scale-105" />
          )}
        </div>
        <div className="min-w-0">
          <p className="eyebrow mb-1 text-[10px] text-accent-2">{label}</p>
          <h3 className="line-clamp-2 font-display text-lg font-semibold uppercase leading-tight group-hover:text-accent-2">{article.title}</h3>
          <p className="mt-1 text-xs text-muted">{formatDate(article.published_at)}</p>
        </div>
      </Link>
    );
  }

  if (variant === "overlay" || variant === "hero") {
    const hero = variant === "hero";
    return (
      <Link
        href={href}
        className={cn(
          "group relative block overflow-hidden rounded-2xl bg-navy-2",
          hero ? "aspect-[4/5] sm:aspect-[16/11] lg:aspect-auto lg:h-full" : "aspect-[4/3]",
          className,
        )}
      >
        {article.cover_image_url && (
          <Image
            src={article.cover_image_url}
            alt=""
            fill
            priority={priority}
            sizes={hero ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" />
        <div className={cn("absolute inset-x-0 bottom-0 p-5 sm:p-7", hero && "lg:p-10")}>
          <div className="mb-3 flex items-center gap-2">
            <Badge tone={isVideo ? "yellow" : "accent"}>{label}</Badge>
            <span className="text-xs text-ice/70">{formatDate(article.published_at)}</span>
          </div>
          <h3
            className={cn(
              "display text-balance",
              hero ? "text-4xl sm:text-5xl lg:text-6xl" : "text-2xl sm:text-3xl",
            )}
          >
            {article.title}
          </h3>
          {hero && <p className="mt-4 max-w-xl text-base text-ice/80 sm:text-lg">{article.excerpt}</p>}
          <span className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-accent px-6 font-display text-sm font-semibold uppercase tracking-[0.12em] text-white transition group-hover:bg-[#ff1a45]">
            {isVideo ? (<><Play className="size-4 fill-current" /> Watch video</>) : "Read story"}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className={cn("group block", className)}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-navy-2">
        {article.cover_image_url && (
          <Image
            src={article.cover_image_url}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}
        {isVideo && (
          <span className="absolute left-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-accent-2 text-night">
            <Play className="ml-0.5 size-4 fill-current" />
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center gap-3 text-xs text-muted">
        <Badge tone="outline">{label}</Badge>
        <span>{formatDate(article.published_at)}</span>
        <span className="inline-flex items-center gap-1"><Clock className="size-3" /> {readingTime(article.body)} min</span>
      </div>
      <h3 className="mt-3 font-display text-2xl font-semibold uppercase leading-[1.05] tracking-tight transition group-hover:text-accent-2">
        {article.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted">{article.excerpt}</p>
    </Link>
  );
}
