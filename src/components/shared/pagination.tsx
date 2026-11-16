import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const btn = "inline-flex size-10 items-center justify-center rounded-full border border-white/12 text-sm font-semibold transition hover:border-white/40";
  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
      {page > 1 && <Link href={makeHref(page - 1)} className={btn} aria-label="Previous page"><ChevronLeft className="size-4" /></Link>}
      {items.map((it, i) =>
        it === "…" ? (
          <span key={`e${i}`} className="px-1 text-muted">…</span>
        ) : (
          <Link key={it} href={makeHref(it)} aria-current={it === page ? "page" : undefined} className={cn(btn, it === page && "border-accent bg-accent text-white")}>{it}</Link>
        ),
      )}
      {page < totalPages && <Link href={makeHref(page + 1)} className={btn} aria-label="Next page"><ChevronRight className="size-4" /></Link>}
    </nav>
  );
}
