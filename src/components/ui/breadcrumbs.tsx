import Link from "next/link";

/** A quiet trail back up the site, used on admin pages. */
export function Breadcrumbs({ items, className }: { items: { label: string; href?: string }[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumbs" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-subtle">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden className="text-subtlest">/</span>}
            {item.href ? (
              <Link href={item.href} className="rounded-sm hover:text-default hover:underline">{item.label}</Link>
            ) : (
              <span aria-current="page" className="line-clamp-1">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
