"use client";
import { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Horizontal rail with a title and round previous/next buttons. Items snap into
 * place and the rail bleeds to the right edge of the screen on small viewports.
 */
export function Carousel({
  title,
  children,
  className,
  itemClassName = "w-[78vw] sm:w-[22rem]",
}: {
  title: string;
  children: ReactNode[];
  className?: string;
  /** Width of each slide. */
  itemClassName?: string;
}) {
  const rail = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = rail.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className={className} aria-label={title}>
      <div className="container-x mb-8 flex items-end justify-between gap-4 sm:mb-10">
        <h2 className="type-heading-xlarge">{title}</h2>
        <div className="flex shrink-0 gap-2">
          <Button iconOnly onClick={() => scroll(-1)} aria-label="Previous"><ChevronLeft className="size-5" aria-hidden /></Button>
          <Button iconOnly onClick={() => scroll(1)} aria-label="Next"><ChevronRight className="size-5" aria-hidden /></Button>
        </div>
      </div>
      <ul
        ref={rail}
        className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-1 sm:scroll-px-6 sm:px-6 lg:scroll-px-10 lg:px-10"
      >
        {children.map((child, i) => (
          <li key={i} className={cn("shrink-0 snap-start", itemClassName)}>{child}</li>
        ))}
      </ul>
    </section>
  );
}
