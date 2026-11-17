import Image from "next/image";
import Link from "next/link";
import { Clock, Play } from "lucide-react";
import { CategoryLozenge } from "@/components/shared/category-lozenge";
import { buttonClass } from "@/components/ui/button";
import { darkSubtree } from "@/lib/theme";
import { cn, formatDate, readingTime } from "@/lib/utils";
import type { Article } from "@/types";

type Variant = "default" | "overlay" | "hero" | "compact";

export function ArticleCard({
  article,
  variant = "default",
  priority = false,
  fill = false,
  className,
}: {
  article: Article;
  variant?: Variant;
  priority?: boolean;
  /** Overlay variant only: stretch to the height of the grid cell instead of keeping a 4:3 shape. */
  fill?: boolean;
  className?: string;
}) {
  const href = `/news/${article.slug}`;
  const isVideo = article.category === "video" || !!article.video_url;

  if (variant === "compact") {
    return (
      <Link href={href} className={cn("group flex gap-3 rounded-lg", className)}>
        <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-md bg-neutral">
          {article.cover_image_url && <Image src={article.cover_image_url} alt="" fill sizes="112px" className="object-cover" />}
        </div>
        <div className="min-w-0 space-y-1">
          <CategoryLozenge category={article.category} />
          <h3 className="type-heading-xsmall line-clamp-2 group-hover:underline">{article.title}</h3>
          <p className="type-body-small text-subtlest">{formatDate(article.published_at)}</p>
        </div>
      </Link>
    );
  }

  if (variant === "overlay" || variant === "hero") {
    const hero = variant === "hero";
    // Text sits on the photograph, so this card is always rendered in the dark theme.
    return (
      <Link
        href={href}
        {...darkSubtree}
        className={cn(
          "group relative isolate flex flex-col justify-end overflow-hidden rounded-xl bg-surface-sunken text-default",
          hero ? "min-h-[26rem] lg:h-full" : fill ? "h-full min-h-56" : "aspect-[4/3]",
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
            className="-z-20 object-cover transition-transform duration-(--ds-duration-xlong) ease-in-out group-hover:scale-[1.02]"
          />
        )}
        <div className={cn("absolute inset-0 -z-10", hero ? "media-scrim-soft" : "media-scrim")} />
        <div className={cn("p-4", hero && "sm:p-8")}>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <CategoryLozenge category={article.category} />
            <span className="type-body-small text-subtle">{formatDate(article.published_at)}</span>
          </div>
          <h3 className={cn("text-balance", hero ? "type-heading-xlarge sm:type-heading-xxlarge max-w-2xl" : "type-heading-medium")}>
            {article.title}
          </h3>
          {hero && <p className="type-body-large mt-2 max-w-xl text-subtle">{article.excerpt}</p>}
          <span className={buttonClass({ appearance: hero ? "primary" : "default", className: hero ? "mt-4" : "mt-3" })}>
            {isVideo ? (<><Play className="size-4 fill-current" aria-hidden /> Watch video</>) : "Read story"}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className={cn("group block rounded-lg", className)}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-neutral">
        {article.cover_image_url && (
          <Image
            src={article.cover_image_url}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-(--ds-duration-xlong) ease-in-out group-hover:scale-[1.02]"
          />
        )}
        {isVideo && (
          <span className="absolute left-3 top-3 inline-flex size-8 items-center justify-center rounded-full bg-surface-overlay text-icon shadow-overlay">
            <Play className="ml-0.5 size-4 fill-current" aria-hidden />
          </span>
        )}
      </div>
      <div className="type-body-small mt-3 flex flex-wrap items-center gap-2 text-subtlest">
        <CategoryLozenge category={article.category} />
        <span>{formatDate(article.published_at)}</span>
        <span className="inline-flex items-center gap-1"><Clock className="size-3" aria-hidden /> {readingTime(article.body)} min read</span>
      </div>
      <h3 className="type-heading-medium mt-2 group-hover:underline">{article.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-subtle">{article.excerpt}</p>
    </Link>
  );
}
