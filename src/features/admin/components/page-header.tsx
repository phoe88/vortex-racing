import { Breadcrumbs } from "@/components/ui/breadcrumbs";

/** Page header: breadcrumb back to the list, title, supporting text and actions. */
export function AdminPageHeader({ title, description, backHref, actions }: { title: string; description?: string; backHref?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {backHref && <Breadcrumbs className="mb-2" items={[{ label: "Back to list", href: backHref }, { label: title }]} />}
        <h1 className="type-heading-large">{title}</h1>
        {description && <p className="mt-1 text-sm text-subtle">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
