"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ScrollState = { scrollable: boolean; atStart: boolean; atEnd: boolean; thumbWidth: number; thumbLeft: number };
const INITIAL: ScrollState = { scrollable: false, atStart: true, atEnd: false, thumbWidth: 1, thumbLeft: 0 };
const DRAG_THRESHOLD = 6;

/**
 * Horizontal scroll rail with a title, round previous/next buttons and a bar
 * showing how far along the rail you are. It scrolls with touch, trackpad,
 * shift + mouse wheel, the arrow buttons, or by clicking and dragging with a
 * mouse. Items snap into place and line up with the page content.
 */
export function Carousel({
  title,
  children,
  className,
  itemClassName = "w-[78vw] sm:w-[22rem]",
  titleClassName = "type-heading-xlarge",
  gap = "gap-4",
}: {
  title: string;
  children: ReactNode[];
  className?: string;
  /** Width of each slide. Leave empty for slides sized by their content. */
  itemClassName?: string;
  titleClassName?: string;
  gap?: string;
}) {
  const rail = useRef<HTMLUListElement>(null);
  const [state, setState] = useState<ScrollState>(INITIAL);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  // Track scroll position for the arrows and the progress bar.
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const measure = () => {
      const max = el.scrollWidth - el.clientWidth;
      const thumbWidth = el.scrollWidth > 0 ? Math.min(1, el.clientWidth / el.scrollWidth) : 1;
      setState({
        scrollable: max > 2,
        atStart: el.scrollLeft <= 2,
        atEnd: el.scrollLeft >= max - 2,
        thumbWidth,
        thumbLeft: max > 0 ? (el.scrollLeft / max) * (1 - thumbWidth) : 0,
      });
    };
    // ResizeObserver also fires once on observe, which takes the first measurement.
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, []);

  const scroll = (dir: 1 | -1) => {
    const el = rail.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  // Click-and-drag scrolling for mouse users. Touch and pens scroll natively.
  const onPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    const el = rail.current;
    if (!el || e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = { x: e.clientX, left: el.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const el = rail.current;
    const d = drag.current;
    if (!el || !d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) < DRAG_THRESHOLD) return;
    if (!d.moved) {
      d.moved = true;
      el.setPointerCapture(e.pointerId);
      el.style.scrollSnapType = "none";
      el.style.cursor = "grabbing";
    }
    el.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    const el = rail.current;
    if (el && drag.current?.moved) {
      el.style.scrollSnapType = "";
      el.style.cursor = "";
    }
    // Keep the flag until the click that follows the drag has been swallowed.
    setTimeout(() => { drag.current = null; }, 0);
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current?.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section className={className} aria-label={title}>
      <div className="rail-x mb-6 flex items-end justify-between gap-4 sm:mb-8">
        <h2 className={titleClassName}>{title}</h2>
        {state.scrollable && (
          <div className="flex shrink-0 gap-2">
            <Button iconOnly onClick={() => scroll(-1)} disabled={state.atStart} aria-label="Scroll back"><ChevronLeft className="size-5" aria-hidden /></Button>
            <Button iconOnly onClick={() => scroll(1)} disabled={state.atEnd} aria-label="Scroll forward"><ChevronRight className="size-5" aria-hidden /></Button>
          </div>
        )}
      </div>
      <ul
        ref={rail}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onDragStart={(e) => e.preventDefault()}
        tabIndex={0}
        aria-label={`${title}, scrolls sideways`}
        className={cn(
          "rail-x scrollbar-none flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain pb-1 select-none focus-visible:outline-offset-4",
          state.scrollable && "cursor-grab",
          gap,
        )}
      >
        {children.map((child, i) => (
          <li key={i} className={cn("shrink-0 snap-start", itemClassName)}>{child}</li>
        ))}
      </ul>
      {state.scrollable && (
        <div className="rail-x mt-6" aria-hidden>
          <div className="relative h-1 overflow-hidden rounded-full bg-neutral">
            <div
              className="absolute inset-y-0 rounded-full bg-white/60 transition-[left] duration-150 ease-out"
              style={{ width: `${state.thumbWidth * 100}%`, left: `${state.thumbLeft * 100}%` }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
