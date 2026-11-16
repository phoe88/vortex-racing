import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function AdminPageHeader({ title, description, backHref, actions }: { title: string; description?: string; backHref?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {backHref && <Link href={backHref} className="mb-2 inline-flex items-center gap-1 text-xs text-muted hover:text-ice"><ArrowLeft className="size-3.5" /> Back</Link>}
        <h1 className="display text-3xl sm:text-4xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  );
}
