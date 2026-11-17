import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Question-and-answer list. Built on <details>, so it opens and closes without
 * JavaScript and works with the keyboard.
 */
export function Accordion({ items, className }: { items: { q: string; a: string }[]; className?: string }) {
  return (
    <div className={cn("divide-y border-y", className)}>
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-bold [&::-webkit-details-marker]:hidden">
            {item.q}
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral transition-transform group-open:rotate-180" aria-hidden>
              <ChevronDown className="size-4" />
            </span>
          </summary>
          <p className="max-w-3xl pb-6 text-subtle">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
