import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Section title with an optional overline, supporting text and a "view all" link. */
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
        "mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "items-center text-center sm:flex-col sm:items-center",
        className,
      )}
    >
      <div>
        {eyebrow && <p className="type-heading-xxsmall mb-1 text-subtlest">{eyebrow}</p>}
        <h2 className="type-heading-large">{title}</h2>
        {children && <p className="mt-2 max-w-2xl text-sm text-subtle">{children}</p>}
      </div>
      {href && (
        <Link href={href} className="link inline-flex shrink-0 items-center gap-1 text-sm font-medium">
          {linkLabel}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
