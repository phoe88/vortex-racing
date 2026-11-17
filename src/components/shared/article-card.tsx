import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { CategoryLozenge } from "@/components/shared/category-lozenge";
import { buttonClass } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import type { Article } from "@/types";

/**
 * Story card: a rounded photo with the text laid over its lower edge.
 * - `hero`: the large lead story, with excerpt and a red button.
 * - `overlay`: fills its grid cell, with excerpt and a red button.
 * - `default`: a portrait tile for grids and rails.
 */
type Variant = "default" | "overlay" | "hero";

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
  const hero = variant === "hero";
  const withAction = variant !== "default";

  return (
    <Link
      href={href}
      className={cn(
        "group relative isolate flex flex-col justify-end overflow-hidden rounded-xl bg-navy-raised",
        variant === "default" && "aspect-[4/5]",
        hero && "min-h-[28rem] lg:h-full",
        variant === "overlay" && "h-full min-h-72",
        className,
      )}
    >
      {article.cover_image_url && (
        <Image
          src={article.cover_image_url}
          alt=""
          fill
          priority={priority}
          sizes={hero ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 85vw"}
          className="-z-20 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      )}
      <div className="media-scrim absolute inset-0 -z-10" />
      {isVideo && (
        <span className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
          <Play className="ml-0.5 size-4 fill-current" aria-hidden />
        </span>
      )}
      <div className={cn("p-5", hero && "sm:p-8")}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <CategoryLozenge category={article.category} />
          {!withAction && <span className="type-body-small text-subtle">{formatDate(article.published_at)}</span>}
        </div>
        <h3 className={cn("text-balance", hero ? "type-heading-large max-w-xl" : "type-heading-small")}>{article.title}</h3>
        {withAction && article.excerpt && (
          <p className={cn("type-body-small mt-3 line-clamp-2 text-subtle", hero ? "max-w-md" : "max-w-sm")}>{article.excerpt}</p>
        )}
        {withAction && (
          <span className={buttonClass({ appearance: "primary", className: "mt-5" })}>
            {isVideo ? (<><Play className="size-4 fill-current" aria-hidden /> Watch</>) : "Read Story"}
          </span>
        )}
      </div>
    </Link>
  );
}
