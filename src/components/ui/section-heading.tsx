import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button";

/** Section title with optional supporting text and a "view all" pill. */
export function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel = "View all",
  align = "left",
  className,
  children,
  actions,
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
  className?: string;
  children?: React.ReactNode;
  /** Extra controls on the right, such as carousel arrows. */
  actions?: React.ReactNode;
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
        {eyebrow && <p className="type-heading-xxsmall mb-2 text-subtle">{eyebrow}</p>}
        <h2 className="type-heading-xlarge">{title}</h2>
        {children && <p className="mt-3 max-w-2xl text-subtle">{children}</p>}
      </div>
      {(href || actions) && (
        <div className="flex shrink-0 items-center gap-2">
          {href && <Link href={href} className={buttonClass()}>{linkLabel}</Link>}
          {actions}
        </div>
      )}
    </div>
  );
}
