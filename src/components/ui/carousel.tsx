"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ScrollState = { scrollable: boolean; atStart: boolean; atEnd: boolean; thumbWidth: number; thumbLeft: number };
const INITIAL: ScrollState = { scrollable: false, atStart: true, atEnd: false, thumbWidth: 1, thumbLeft: 0 };
const DRAG_THRESHOLD = 6;

/**
 * Horizontal scroll rail with a title, round previous/next buttons and a
 * scrollbar under the items. It scrolls with touch, trackpad, shift + mouse
 * wheel, the arrow buttons, the keyboard, by dragging the items with a mouse,
 * or by dragging or clicking the scrollbar. Items snap into place and line up
 * with the page content.
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
  const track = useRef<HTMLDivElement>(null);
  const barDrag = useRef<{ x: number; left: number; ratio: number } | null>(null);
  const [barDragging, setBarDragging] = useState(false);
  const railId = useId();

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
  // Scrollbar: drag the thumb, or press anywhere on the track to jump there and keep dragging.
  const onTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = rail.current;
    const t = track.current;
    if (!el || !t || (e.pointerType === "mouse" && e.button !== 0)) return;
    e.preventDefault();
    // preventDefault stops the browser focusing the bar, so focus it here for keyboard use.
    t.focus({ preventScroll: true });
    const rect = t.getBoundingClientRect();
    const max = el.scrollWidth - el.clientWidth;
    const thumbPx = state.thumbWidth * rect.width;
    const free = Math.max(1, rect.width - thumbPx);
    const thumbStart = rect.left + state.thumbLeft * rect.width;
    let left = el.scrollLeft;
    if (e.clientX < thumbStart || e.clientX > thumbStart + thumbPx) {
      // Centre the thumb under the pointer.
      const frac = Math.min(1, Math.max(0, (e.clientX - rect.left - thumbPx / 2) / free));
      left = frac * max;
    }
    el.style.scrollSnapType = "none";
    el.scrollLeft = left;
    barDrag.current = { x: e.clientX, left, ratio: max / free };
    t.setPointerCapture(e.pointerId);
    setBarDragging(true);
  };
  const onTrackPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = rail.current;
    const d = barDrag.current;
    if (!el || !d) return;
    el.scrollLeft = d.left + (e.clientX - d.x) * d.ratio;
  };
  const endBarDrag = () => {
    const el = rail.current;
    if (!barDrag.current) return;
    barDrag.current = null;
    setBarDragging(false);
    if (el) el.style.scrollSnapType = "";
  };
  const onTrackKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const el = rail.current;
    if (!el) return;
    const step = el.clientWidth * 0.8;
    const to =
      e.key === "ArrowRight" || e.key === "PageDown" ? el.scrollLeft + step
      : e.key === "ArrowLeft" || e.key === "PageUp" ? el.scrollLeft - step
      : e.key === "Home" ? 0
      : e.key === "End" ? el.scrollWidth
      : null;
    if (to === null) return;
    e.preventDefault();
    el.scrollTo({ left: to, behavior: "smooth" });
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
        id={railId}
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
        <div className="rail-x mt-3">
          {/* The visible bar is thin; the hit area around it is tall enough to grab. */}
          <div
            ref={track}
            role="scrollbar"
            aria-controls={railId}
            aria-orientation="horizontal"
            aria-label={`Scroll ${title}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(state.thumbWidth < 1 ? (state.thumbLeft / (1 - state.thumbWidth)) * 100 : 0)}
            tabIndex={0}
            onPointerDown={onTrackPointerDown}
            onPointerMove={onTrackPointerMove}
            onPointerUp={endBarDrag}
            onPointerCancel={endBarDrag}
            onKeyDown={onTrackKeyDown}
            className={cn(
              "group/bar relative flex h-6 touch-none select-none items-center rounded-full",
              barDragging ? "cursor-grabbing" : "cursor-pointer",
            )}
          >
            <div className="relative h-1 w-full rounded-full bg-neutral transition-[height] group-hover/bar:h-1.5">
              <div
                className={cn(
                  "absolute inset-y-0 rounded-full bg-white/60 group-hover/bar:bg-white/80",
                  barDragging ? "bg-white" : "transition-[left] duration-150 ease-out",
                )}
                style={{ width: `${state.thumbWidth * 100}%`, left: `${state.thumbLeft * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
