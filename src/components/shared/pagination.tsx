import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonClass } from "@/components/ui/button";

export function Pagination({ page, totalPages, makeHref }: { page: number; totalPages: number; makeHref: (p: number) => string }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );
  const items: (number | "…")[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) items.push("…");
    items.push(p);
  });
  const iconBtn = buttonClass({ appearance: "subtle", iconOnly: true });
  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-1">
      {page > 1 && <Link href={makeHref(page - 1)} className={iconBtn} aria-label="Previous page"><ChevronLeft className="size-4" aria-hidden /></Link>}
      {items.map((it, i) =>
        it === "…" ? (
          <span key={`e${i}`} className="inline-flex size-8 items-center justify-center text-subtle" aria-hidden>…</span>
        ) : (
          <Link
            key={it}
            href={makeHref(it)}
            aria-current={it === page ? "page" : undefined}
            className={buttonClass({ appearance: "subtle", isSelected: it === page, className: "min-w-8 px-2! tabular-nums" })}
          >
            {it}
          </Link>
        ),
      )}
      {page < totalPages && <Link href={makeHref(page + 1)} className={iconBtn} aria-label="Next page"><ChevronRight className="size-4" aria-hidden /></Link>}
    </nav>
  );
}
