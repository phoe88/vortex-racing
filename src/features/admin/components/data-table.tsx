import { cn } from "@/lib/utils";

/* Table styling follows the Atlassian Design System dynamic table: small bold
   subtle headers over a 2px rule, hairline row dividers and a hover tint. */
export function DataTable({ head, children, className }: { head: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr>{head}</tr>
        </thead>
        <tbody className="[&>tr]:border-b [&>tr]:transition-colors [&>tr:hover]:bg-neutral-subtle-hovered">{children}</tbody>
      </table>
    </div>
  );
}

export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <th className={cn("type-body-small border-b-2 px-2 py-1.5 font-bold text-subtle", className)}>{children}</th>;
}
export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("px-2 py-2 align-middle", className)}>{children}</td>;
}

/** Empty state: a short heading and one line on what to do next. */
export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-dashed px-6 py-12 text-center">
      <p className="type-heading-medium">{title}</p>
      {hint && <p className="mt-1 text-sm text-subtle">{hint}</p>}
    </div>
  );
}
