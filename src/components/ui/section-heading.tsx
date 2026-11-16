import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel = "View all",
  align = "left",
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "items-center text-center sm:flex-col sm:items-center",
        className,
      )}
    >
      <div>
        {eyebrow && <p className="eyebrow mb-3 text-accent">{eyebrow}</p>}
        <h2 className="display text-4xl sm:text-5xl lg:text-6xl">{title}</h2>
        {children && <p className="mt-4 max-w-2xl text-base text-muted">{children}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1 font-display text-sm font-semibold uppercase tracking-[0.16em] text-ice/80 transition hover:text-accent-2"
        >
          {linkLabel}
          <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
